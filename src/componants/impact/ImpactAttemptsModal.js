import React, { useState } from "react";
import ImageModal from "../Modals/ImageModal";
import styles from "./ImpactAttemptsModal.module.css";
import {
  correctAttempt,
  impactError,
  impactPhotoUrl,
  listShots,
} from "./impactApi";

const orDash = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

// A photograph tile. The API exposes no URL for stored photographs yet, so
// when impactPhotoUrl returns null the tile names the evidence instead of
// rendering a broken image.
const PhotoTile = ({ photo, onOpen }) => {
  const url = impactPhotoUrl(photo);
  const label = photo.note || photo.filename || `photo ${photo.id}`;

  if (!url) {
    return (
      <span className={styles.photoStub} title={label}>
        {label}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={label}
      title={label}
      className={styles.thumb}
      onClick={() => onOpen(photo)}
    />
  );
};

// ONE ATTEMPT IS ONE IMPACT, so this list is the test's impact sequence:
// attempt N is impact N. Attempts recorded before that change can still hold
// several impacts, which is why each row still expands to its own shots.
const ImpactAttemptsModal = ({
  visible,
  test,
  operatorName,
  onChanged,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(null);
  const [shotsByAttempt, setShotsByAttempt] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [fullPhoto, setFullPhoto] = useState(null);
  const [correcting, setCorrecting] = useState(null); // attempt being corrected
  const [reason, setReason] = useState("");
  const [correctBusy, setCorrectBusy] = useState(false);

  if (!visible || !test) return null;

  const trials = test.trials || [];

  // Impacts are not embedded in the attempt — they come from
  // GET /test-results/{id}/shots, so fetch them the first time a row opens.
  const toggle = async (attemptId) => {
    if (expanded === attemptId) {
      setExpanded(null);
      return;
    }
    setExpanded(attemptId);

    if (shotsByAttempt[attemptId]) return;
    try {
      setLoadingId(attemptId);
      const shots = await listShots(attemptId);
      setShotsByAttempt((prev) => ({ ...prev, [attemptId]: shots }));
    } catch (err) {
      setError(impactError(err, "Could not load the impacts."));
    } finally {
      setLoadingId(null);
    }
  };

  const operatorCall = (attempt) => {
    if (attempt.status === "Aborted")
      return `Aborted — ${orDash(attempt.abort_reason)}`;
    if (attempt.result === null || attempt.result === undefined) return "—";
    return attempt.result ? "Resisted" : "Did not resist";
  };

  // A recorded result cannot be edited or deleted - the terminal state is
  // final - so a mistake is superseded by a new attempt naming this one.
  const submitCorrection = async () => {
    if (!reason.trim()) return;
    try {
      setCorrectBusy(true);
      setError("");
      await correctAttempt(correcting.id, {
        reason: reason.trim(),
        operatorName: operatorName || null,
      });
      setCorrecting(null);
      setReason("");
      if (onChanged) onChanged();
      onClose();
    } catch (err) {
      // The refusals say what to do: finish the open attempt, or supply a
      // reason, or correct a terminal attempt rather than an open one.
      setError(impactError(err, "Could not record the correction."));
    } finally {
      setCorrectBusy(false);
    }
  };

  const retest = (attempt) => {
    // null until a verdict: "not yet reviewed", never an unchecked box.
    if (
      attempt.retest_required === null ||
      attempt.retest_required === undefined
    ) {
      return "not yet reviewed";
    }
    return attempt.retest_required ? "Yes" : "No";
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              Attempts
              <span className={styles.subtitle}>
                Impact test {test.id}
                {test.missile ? ` · ${test.missile}` : ""}
              </span>
            </h3>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.body}>
            {error && <p className={styles.error}>{error}</p>}

            <table className="table table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "70px" }}>Impact</th>
                  <th style={{ width: "150px" }}>LabOS Attempt ID</th>
                  <th style={{ width: "110px" }}>Operator</th>
                  <th style={{ width: "100px" }}>State</th>
                  <th style={{ width: "150px" }}>Operator Result</th>
                  <th style={{ width: "100px" }}>Review</th>
                  <th style={{ width: "120px" }}>Retest required</th>
                  <th style={{ width: "90px" }}>Photos</th>
                  <th style={{ width: "80px" }}>Shots</th>
                  <th style={{ width: "90px" }}>Correct</th>
                </tr>
              </thead>
              <tbody>
                {trials.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.muted}>
                      This test has no impacts yet.
                    </td>
                  </tr>
                ) : (
                  trials.map((attempt) => {
                    const shots = shotsByAttempt[attempt.id];
                    const isOpen = expanded === attempt.id;
                    // Only a finished result can be superseded; an open attempt
                    // is completed correctly instead.
                    const terminal =
                      attempt.status === "Completed" ||
                      attempt.status === "Aborted";

                    return (
                      <React.Fragment key={attempt.id}>
                        <tr
                          className={styles.attemptRow}
                          onClick={() => toggle(attempt.id)}
                        >
                          <td>
                            <strong>{attempt.trial_number}</strong>
                            {attempt.corrects_attempt_id && (
                              <span
                                className={styles.correctionMark}
                                title={`Supersedes ${attempt.corrects_attempt_id} - ${orDash(
                                  attempt.correction_reason
                                )}`}
                              >
                                {" "}
                                &#8634;
                              </span>
                            )}
                          </td>
                          <td className={styles.mono}>
                            {orDash(attempt.labos_attempt_id)}
                          </td>
                          <td>{orDash(attempt.operator_name)}</td>
                          <td>{orDash(attempt.status)}</td>
                          <td>{operatorCall(attempt)}</td>
                          <td>
                            <span
                              className={
                                attempt.test_result === "Pass"
                                  ? styles.verdictPass
                                  : attempt.test_result === "Fail"
                                  ? styles.verdictFail
                                  : styles.verdictPending
                              }
                            >
                              {orDash(attempt.test_result)}
                            </span>
                          </td>
                          <td className={styles.muted}>{retest(attempt)}</td>
                          <td>{(attempt.photos || []).length}</td>
                          <td>
                            {loadingId === attempt.id
                              ? "…"
                              : `${shots ? shots.length : ""} ${isOpen ? "▲" : "▼"}`}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {terminal ? (
                              <button
                                type="button"
                                className={styles.correctButton}
                                onClick={() => {
                                  setCorrecting(attempt);
                                  setReason("");
                                }}
                                title="Supersede this recorded result with a new impact"
                              >
                                Correct
                              </button>
                            ) : (
                              <span className={styles.muted}>open</span>
                            )}
                          </td>
                        </tr>

                        {isOpen && (
                          <tr>
                            <td colSpan="10" className={styles.shotCell}>
                              {!shots ? (
                                <p className={styles.noShots}>Loading impacts…</p>
                              ) : shots.length === 0 ? (
                                <p className={styles.noShots}>
                                  No impacts recorded on this attempt.
                                </p>
                              ) : (
                                <table className="table table-sm table-bordered mb-0 text-center align-middle">
                                  <thead className={styles.shotHead}>
                                    <tr>
                                      <th style={{ width: "70px" }}>Impact</th>
                                      <th style={{ width: "110px" }}>Area</th>
                                      <th style={{ width: "120px" }}>
                                        Velocity (ft/s)
                                      </th>
                                      <th style={{ width: "90px" }}>Result</th>
                                      <th>Note</th>
                                      <th style={{ width: "230px" }}>
                                        Photographs
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {shots.map((shot) => (
                                      <tr key={shot.id}>
                                        {/* shot_number, never the shot id */}
                                        <td>
                                          <strong>{shot.shot_number}</strong>
                                        </td>
                                        <td>{orDash(shot.area)}</td>
                                        <td>{orDash(shot.velocity)}</td>
                                        <td
                                          className={
                                            shot.result
                                              ? styles.shotPass
                                              : styles.shotFail
                                          }
                                        >
                                          {shot.result ? "Pass" : "Fail"}
                                        </td>
                                        <td className={styles.noteCell}>
                                          {orDash(shot.note)}
                                        </td>
                                        <td>
                                          {(shot.photos || []).length === 0 ? (
                                            <span className={styles.muted}>
                                              none
                                            </span>
                                          ) : (
                                            <div className={styles.thumbs}>
                                              {shot.photos.map((photo) => (
                                                <PhotoTile
                                                  key={photo.id}
                                                  photo={photo}
                                                  onOpen={setFullPhoto}
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}

                              {/* Attempt-level evidence: shot_id is null on these. */}
                              <div className={styles.attemptPhotos}>
                                <span className={styles.attemptPhotosLabel}>
                                  Attempt photographs
                                </span>
                                {(attempt.photos || []).filter(
                                  (p) => p.shot_id == null
                                ).length === 0 ? (
                                  <span className={styles.muted}>none</span>
                                ) : (
                                  <div className={styles.thumbs}>
                                    {(attempt.photos || [])
                                      .filter((p) => p.shot_id == null)
                                      .map((photo) => (
                                        <PhotoTile
                                          key={photo.id}
                                          photo={photo}
                                          onOpen={setFullPhoto}
                                        />
                                      ))}
                                  </div>
                                )}
                              </div>

                              {attempt.corrects_attempt_id && (
                                <p className={styles.attemptNote}>
                                  <strong>Correction of</strong>{" "}
                                  <span className={styles.mono}>
                                    {attempt.corrects_attempt_id}
                                  </span>{" "}
                                  - {orDash(attempt.correction_reason)}
                                </p>
                              )}

                              {attempt.note && (
                                <p className={styles.attemptNote}>
                                  <strong>Note:</strong> {attempt.note}
                                </p>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {correcting && (
            <div className={styles.correctBox}>
              <p className={styles.correctTitle}>
                Supersede impact {correcting.trial_number}
              </p>
              <p className={styles.correctAside}>
                This deletes nothing. It opens a new impact on this test that
                names impact {correcting.trial_number} as the one it replaces,
                so a correction is never mistaken for a retest. The test must
                have no impact open.
              </p>
              <input
                type="text"
                className="form-control"
                placeholder="Why is this being corrected? (required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className={styles.correctButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setCorrecting(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={submitCorrection}
                  disabled={correctBusy || !reason.trim()}
                >
                  Open correction
                </button>
              </div>
            </div>
          )}

          <p className={styles.footnote}>
            &ldquo;Completed&rdquo; next to &ldquo;Pending&rdquo; is correct - it
            means tested, awaiting review. Every impact is retained: a wrong
            result is superseded by a correction, never edited away.
          </p>
        </div>
      </div>

      <ImageModal
        isOpen={fullPhoto !== null}
        onClose={() => setFullPhoto(null)}
        imageSrc={fullPhoto ? impactPhotoUrl(fullPhoto) || "" : ""}
        altText={fullPhoto?.filename || "Impact photograph"}
      />
    </>
  );
};

export default ImpactAttemptsModal;
