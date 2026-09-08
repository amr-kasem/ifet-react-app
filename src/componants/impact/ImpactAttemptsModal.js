import React, { useState } from "react";
import ImageModal from "../Modals/ImageModal";
import styles from "./ImpactAttemptsModal.module.css";
import { impactError, impactPhotoUrl, listShots } from "./impactApi";

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

const ImpactAttemptsModal = ({ visible, test, onClose }) => {
  const [expanded, setExpanded] = useState(null);
  const [shotsByAttempt, setShotsByAttempt] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [fullPhoto, setFullPhoto] = useState(null);

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
                  <th style={{ width: "70px" }}>Attempt</th>
                  <th style={{ width: "150px" }}>LabOS Attempt ID</th>
                  <th style={{ width: "110px" }}>Operator</th>
                  <th style={{ width: "100px" }}>State</th>
                  <th style={{ width: "150px" }}>Operator Result</th>
                  <th style={{ width: "100px" }}>Review</th>
                  <th style={{ width: "120px" }}>Retest required</th>
                  <th style={{ width: "90px" }}>Photos</th>
                  <th style={{ width: "80px" }}>Impacts</th>
                </tr>
              </thead>
              <tbody>
                {trials.length === 0 ? (
                  <tr>
                    <td colSpan="9" className={styles.muted}>
                      This test has no attempts yet.
                    </td>
                  </tr>
                ) : (
                  trials.map((attempt) => {
                    const shots = shotsByAttempt[attempt.id];
                    const isOpen = expanded === attempt.id;

                    return (
                      <React.Fragment key={attempt.id}>
                        <tr
                          className={styles.attemptRow}
                          onClick={() => toggle(attempt.id)}
                        >
                          <td>
                            <strong>{attempt.trial_number}</strong>
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
                        </tr>

                        {isOpen && (
                          <tr>
                            <td colSpan="9" className={styles.shotCell}>
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

          <p className={styles.footnote}>
            &ldquo;Completed&rdquo; next to &ldquo;Pending&rdquo; is correct — it
            means tested, awaiting review. Every attempt is retained.
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
