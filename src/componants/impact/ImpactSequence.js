import React, { useEffect, useRef, useState } from "react";
import styles from "./ImpactSequence.module.css";
import {
  impactError,
  listImpactAttempts,
  listShots,
  uploadPhotos,
} from "./impactApi";

// The impact sequence of the selected test, on the page's white ground rather
// than inside the dark device card.
//
// ONE ATTEMPT IS ONE IMPACT, so this lists the test's ATTEMPTS: impact N is
// attempt N. It loads its own data and reloads whenever `refreshToken` changes,
// which ImpactPanel bumps after recording, photographing or completing one.
const ImpactSequence = ({ projectId, testId, attempt, refreshToken }) => {
  const fileInputRef = useRef();
  const targetRef = useRef(null); // {shotId} or {attemptId}

  const [impacts, setImpacts] = useState([]);
  const [openShot, setOpenShot] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!projectId || !testId) {
        setImpacts([]);
        setOpenShot(null);
        return;
      }
      try {
        const rows = await listImpactAttempts(projectId, testId);
        if (!cancelled) setImpacts(rows);
      } catch (err) {
        if (!cancelled) setError(impactError(err, "Could not load the impacts."));
      }

      // The open attempt's result lives on its shot until it is completed.
      if (!attempt?.id) {
        if (!cancelled) setOpenShot(null);
        return;
      }
      try {
        const shots = await listShots(attempt.id);
        if (!cancelled) setOpenShot(shots.length > 0 ? shots[0] : null);
      } catch (err) {
        if (!cancelled) setOpenShot(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, testId, attempt?.id, refreshToken]);

  const reload = async () => {
    if (!projectId || !testId) return;
    try {
      setImpacts(await listImpactAttempts(projectId, testId));
    } catch (err) {
      setError(impactError(err, "Could not load the impacts."));
    }
  };

  // An attempt's outcome is its impact's outcome, but only once it is finished;
  // while it is open the shot is the only place the result exists.
  const outcomeOf = (row) => {
    if (row.status === "Aborted") return null;
    if (row.id === attempt?.id && openShot) return openShot.result;
    return row.result === null || row.result === undefined ? null : row.result;
  };

  const passCount = impacts.filter((r) => outcomeOf(r) === true).length;
  const failCount = impacts.filter((r) => outcomeOf(r) === false).length;

  // shot_id says which impact the photograph shows, so resolve the shot when
  // there is one and fall back to the attempt when there is not.
  const pickPhotos = async (row) => {
    try {
      setError("");
      let shot = row.id === attempt?.id ? openShot : null;
      if (!shot) {
        const shots = await listShots(row.id);
        shot = shots.length > 0 ? shots[0] : null;
      }
      targetRef.current = shot ? { shotId: shot.id } : { attemptId: row.id };
      fileInputRef.current?.click();
    } catch (err) {
      setError(impactError(err, "Could not open that impact."));
    }
  };

  const handleFilesPicked = async (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = ""; // let the same file be picked again
    const target = targetRef.current;
    targetRef.current = null;
    if (!target) return;

    const images = picked.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setError("No image files in that selection.");
      return;
    }

    try {
      setProgress(0);
      const { failed } = await uploadPhotos(target, images, setProgress);
      if (failed.length > 0) setError(`${failed.length} failed: ${failed[0].reason}`);
      await reload();
    } catch (err) {
      setError(impactError(err, "Upload failed."));
    } finally {
      setProgress(null);
    }
  };

  if (!testId) return null;

  return (
    <div className={styles.section}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesPicked}
      />

      <div className="row">
        <div className="col-6 col-md-5 col-lg-4">
          <h4 className={styles.heading}>Impacts</h4>
        </div>
        <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
          <span className={styles.count}>{impacts.length} recorded</span>
          <span className={styles.tallyPass}>{passCount} pass</span>
          <span className={styles.tallyFail}>{failCount} fail</span>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button
            type="button"
            className={styles.errorClose}
            onClick={() => setError("")}
          >
            &times;
          </button>
        </div>
      )}

      {progress !== null && (
        <div className={`progress ${styles.progress}`}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {impacts.length === 0 ? (
        <p className={styles.empty}>
          No impacts on this test yet. Press Success or Fail to record the first.
        </p>
      ) : (
        /* A grid rather than one row each: an impact test can hold any number,
           and the sequence must not grow the page without bound. */
        <div className={styles.grid}>
          {impacts.map((row) => {
            const photos = (row.photos || []).length;
            const outcome = outcomeOf(row);
            const aborted = row.status === "Aborted";
            const reviewed = row.test_result !== "Pending";
            return (
              <div
                key={row.id}
                className={`${styles.impactCard} ${
                  aborted
                    ? styles.cardAborted
                    : outcome === true
                    ? styles.cardPass
                    : outcome === false
                    ? styles.cardFail
                    : styles.cardOpen
                } ${row.id === attempt?.id ? styles.cardCurrent : ""}`}
              >
                <span className={styles.number}>#{row.trial_number}</span>
                <span
                  className={
                    aborted
                      ? styles.aborted
                      : outcome === true
                      ? styles.pass
                      : outcome === false
                      ? styles.fail
                      : styles.open
                  }
                >
                  {aborted
                    ? "Abort"
                    : outcome === true
                    ? "Pass"
                    : outcome === false
                    ? "Fail"
                    : "open"}
                </span>
                {row.corrects_attempt_id && (
                  <span
                    className={styles.correctionMark}
                    title={`Supersedes ${row.corrects_attempt_id} — ${
                      row.correction_reason || ""
                    }`}
                  >
                    &#8634;
                  </span>
                )}
                <span className={styles.photos}>
                  {photos} {photos === 1 ? "photo" : "photos"}
                </span>
                <button
                  type="button"
                  className={styles.addPhoto}
                  onClick={() => pickPhotos(row)}
                  disabled={progress !== null || aborted || reviewed}
                  title={
                    reviewed
                      ? "Reviewed — evidence is frozen"
                      : aborted
                      ? "An aborted impact takes no evidence"
                      : "Attach photographs to this impact"
                  }
                >
                  + Photos
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImpactSequence;
