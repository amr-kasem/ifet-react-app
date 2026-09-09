import React, { useEffect, useRef, useState } from "react";
import ImpactFinishModal from "./ImpactFinishModal";
import ImpactPhotosModal from "./ImpactPhotosModal";
import styles from "./ImpactPanel.module.css";
import {
  finishAttempt,
  impactError,
  listShots,
  recordShot,
  startImpactAttempt,
  uploadPhotos,
} from "./impactApi";

// ONE ATTEMPT IS ONE IMPACT (backend TC1h). Recording an impact starts an
// attempt and posts its single shot; completing that attempt closes the impact,
// and the next impact is the next attempt.
//
// This panel drives ONE impact - the open one. The sequence of all of them is
// ImpactSequence, on the white ground below the device card; `onChanged` tells
// it to reload after anything here changes what it shows.
const ImpactPanel = ({
  projectId,
  testId,
  attempt,
  setAttempt,
  operatorName,
  setOperatorName,
  onAttemptStarted,
  onAttemptClosed,
  onChanged,
}) => {
  const filesInputRef = useRef();
  const folderInputRef = useRef();
  const shotFilesInputRef = useRef();
  const photoTargetRef = useRef(null); // {shotId} or {attemptId}

  const [shots, setShots] = useState([]); // the OPEN attempt's impact (0 or 1)
  const [attemptPhotos, setAttemptPhotos] = useState([]);
  const [showFinish, setShowFinish] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  // webkitdirectory is not a React prop, so it goes on the node directly.
  useEffect(() => {
    if (!folderInputRef.current) return;
    folderInputRef.current.setAttribute("webkitdirectory", "");
    folderInputRef.current.setAttribute("directory", "");
  }, []);

  const flash = (text, tone = "info") => {
    setMessage({ text, tone });
    setTimeout(() => setMessage(null), 6000);
  };

  // The sequence below the card owns the list; this only asks it to reload.
  const changed = () => {
    if (onChanged) onChanged();
  };

  const loadShots = async (attemptId) => {
    if (!attemptId) {
      setShots([]);
      return;
    }
    try {
      setShots(await listShots(attemptId));
    } catch (error) {
      console.error("Could not load the impact", error);
    }
  };

  useEffect(() => {
    // shot_id null means attempt-level. The attempt also carries its shot's
    // photos, so filtering here stops the same file appearing twice.
    setAttemptPhotos((attempt?.photos || []).filter((p) => p.shot_id == null));
    loadShots(attempt?.id);
  }, [attempt?.id]);

  const inProgress = attempt?.status === "In Progress";
  const evidenceOpen = attempt?.test_result === "Pending";

  // Legacy attempts recorded before TC1h can hold several impacts; the current
  // routes allow only one, so this is the impact of the open attempt.
  const currentShot = shots.length > 0 ? shots[0] : null;

  const photoCount =
    attemptPhotos.length +
    shots.reduce((n, s) => n + (s.photos?.length || 0), 0);

  const needsImpact = inProgress && !currentShot;
  const needsPhoto = inProgress && currentShot && photoCount === 0;
  const readyToComplete = inProgress && currentShot && photoCount > 0;

  // Success / Fail records THIS attempt's impact. Starting is idempotent on the
  // backend - an open attempt is returned, not duplicated - so pressing either
  // button opens the attempt when there is none, and the operator never has to
  // press Start first.
  const handleRecordImpact = async (result) => {
    if (!testId) {
      flash("Select an impact test first.", "error");
      return;
    }
    // Guarded here as well as by the 409, so the refusal names what to do next.
    if (currentShot) {
      flash(
        `Impact ${currentShot.shot_number} is already recorded on this attempt. ` +
          "One attempt is one impact - complete or abort it, then record the next.",
        "error"
      );
      return;
    }

    try {
      setBusy(true);
      const open =
        attempt && inProgress
          ? attempt
          : await startImpactAttempt(projectId, testId, operatorName || null);

      if (!attempt || attempt.id !== open.id) {
        setAttempt(open);
        if (onAttemptStarted) onAttemptStarted(open);
      }

      const shot = await recordShot(open.id, { result });
      await loadShots(open.id);
      changed();
      flash(
        `Impact ${shot.shot_number} recorded as ${result ? "PASS" : "FAIL"}. ` +
          "Attach a photograph, then complete it.",
        "success"
      );
    } catch (error) {
      flash(impactError(error, "Could not record the impact."), "error");
      changed();
    } finally {
      setBusy(false);
    }
  };

  const handleFilesPicked = async (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = ""; // let the same file be picked again
    const target = photoTargetRef.current;
    photoTargetRef.current = null;

    // A picked folder carries everything inside it, images or not.
    const images = picked.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      flash("No image files in that selection.", "error");
      return;
    }

    const destination = target || { attemptId: attempt?.id };
    if (!destination.shotId && !destination.attemptId) return;

    try {
      setProgress(0);
      // One request per photograph - that is what the API accepts.
      const { saved, failed } = await uploadPhotos(
        destination,
        images,
        setProgress
      );

      // A shot photograph carries test_result_id too, so either destination
      // satisfies the finish gate; reload whichever view holds the count.
      if (destination.shotId && destination.shotId === currentShot?.id) {
        await loadShots(attempt.id);
      } else if (!destination.shotId && destination.attemptId === attempt?.id) {
        setAttemptPhotos((prev) => [...prev, ...saved]);
      }
      changed();

      const skipped = picked.length - images.length;
      const parts = [
        `${saved.length} photograph${saved.length === 1 ? "" : "s"} added`,
      ];
      if (skipped > 0) parts.push(`${skipped} non-image skipped`);
      if (failed.length > 0)
        parts.push(`${failed.length} failed: ${failed[0].reason}`);

      flash(`${parts.join(" - ")}.`, failed.length > 0 ? "error" : "success");
    } catch (error) {
      flash(impactError(error, "Upload failed."), "error");
    } finally {
      setProgress(null);
    }
  };

  // shot_id says which impact the photograph shows, so target the shot when
  // there is one. Past impacts are photographed from the sequence below.
  const pickPhotosForCurrent = () => {
    photoTargetRef.current = currentShot
      ? { shotId: currentShot.id }
      : { attemptId: attempt?.id };
    shotFilesInputRef.current?.click();
  };

  const handleFinish = async (body) => {
    try {
      setBusy(true);
      const updated = await finishAttempt(attempt.id, body);
      setShowFinish(false);
      setAttempt(updated);
      setShots([]);
      changed();
      flash(
        updated.status === "Aborted"
          ? `Impact ${updated.trial_number} aborted - ${updated.abort_reason}.`
          : `Impact ${updated.trial_number} completed. Awaiting review.`,
        "success"
      );
      if (onAttemptClosed) onAttemptClosed(updated);
    } catch (error) {
      // The detail says what is missing - the impact, or a photograph.
      flash(impactError(error, "Could not complete the impact."), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <ImpactFinishModal
        visible={showFinish}
        impactNumber={attempt?.trial_number}
        shot={currentShot}
        photoCount={photoCount}
        busy={busy}
        onCancel={() => setShowFinish(false)}
        onSubmit={handleFinish}
      />

      <ImpactPhotosModal
        visible={showGallery}
        attempt={attempt}
        attemptPhotos={attemptPhotos}
        shots={shots}
        onClose={() => setShowGallery(false)}
      />

      <div className={styles.panel}>
        <div className={styles.operatorRow}>
          <label className={styles.operatorLabel} htmlFor="impact_operator">
            Operator
          </label>
          <input
            id="impact_operator"
            type="text"
            className="form-control"
            placeholder="e.g. technician-1"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            disabled={inProgress}
            title="A declared name, not a login. Remembered for this device."
          />
          {inProgress && (
            <span className={styles.attemptBadge}>
              Impact {attempt.trial_number} &middot; open
            </span>
          )}
        </div>

        <div className={styles.resultRow}>
          <button
            type="button"
            className={`btn btn-success btn-lg ${styles.resultButton}`}
            onClick={() => handleRecordImpact(true)}
            disabled={!testId || busy || !!currentShot}
          >
            Success
          </button>
          <button
            type="button"
            className={`btn btn-danger btn-lg ${styles.resultButton}`}
            onClick={() => handleRecordImpact(false)}
            disabled={!testId || busy || !!currentShot}
          >
            Fail
          </button>
        </div>

        <p className={styles.hint}>
          {!testId
            ? "Select an impact test to begin."
            : currentShot
            ? "One attempt is one impact. Complete this one to record the next."
            : "Each press records one impact and opens its attempt."}
        </p>

        {/* What this impact still needs, in the order the API requires it.
            Always rendered - an idle variant when nothing is open - so that
            pressing Success or Fail does not make the card jump taller. */}
        <div
          className={`${styles.currentStrip} ${
            !inProgress
              ? styles.currentIdle
              : readyToComplete
              ? styles.currentReady
              : styles.currentWaiting
          }`}
        >
          {inProgress ? (
            <>
              <span className={styles.currentLabel}>
                Impact {attempt.trial_number}
              </span>
              {currentShot ? (
                <span
                  className={
                    currentShot.result ? styles.shotPass : styles.shotFail
                  }
                >
                  {currentShot.result ? "Pass" : "Fail"}
                </span>
              ) : (
                <span className={styles.currentMuted}>not recorded</span>
              )}
              <span className={styles.currentNeed}>
                {needsImpact
                  ? "Press Success or Fail."
                  : needsPhoto
                  ? "At least one photograph is required."
                  : `${photoCount} photograph${
                      photoCount === 1 ? "" : "s"
                    } - ready.`}
              </span>
              {currentShot && (
                <button
                  type="button"
                  className={styles.shotAddPhoto}
                  onClick={pickPhotosForCurrent}
                  disabled={progress !== null || !evidenceOpen}
                >
                  + Photos
                </button>
              )}
            </>
          ) : (
            <span className={styles.currentMuted}>
              No impact open - Success or Fail records the next one.
            </span>
          )}
        </div>

        <hr className={styles.divider} />

        <div className={styles.footerRow}>
          <div className={styles.uploadRow}>
            <input
              ref={filesInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFilesPicked}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFilesPicked}
            />
            <input
              ref={shotFilesInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFilesPicked}
            />

            <button
              type="button"
              className={`btn btn-light ${styles.uploadButton}`}
              onClick={() => filesInputRef.current?.click()}
              disabled={!inProgress || progress !== null || !evidenceOpen}
              title="Evidence for this impact's attempt - the specimen before, the overall setup"
            >
              Upload Images
            </button>
            <button
              type="button"
              className={`btn btn-light ${styles.uploadButton}`}
              onClick={() => folderInputRef.current?.click()}
              disabled={!inProgress || progress !== null || !evidenceOpen}
            >
              Upload Folder
            </button>
            <button
              type="button"
              className={`btn btn-outline-light ${styles.uploadButton}`}
              onClick={() => setShowGallery(true)}
              disabled={photoCount === 0}
            >
              Preview ({photoCount})
            </button>
          </div>

          {inProgress && (
            <button
              type="button"
              className={`btn btn-primary ${styles.finishButton}`}
              onClick={() => setShowFinish(true)}
              disabled={busy}
            >
              {readyToComplete
                ? `Complete impact ${attempt.trial_number}`
                : `Finish impact ${attempt.trial_number}`}
            </button>
          )}
        </div>

        {/* One reserved slot for the upload bar and the flash message, so
            neither appearing changes the height of the card. */}
        <div className={styles.messageSlot}>
          {progress !== null ? (
            <div className={`progress ${styles.progress}`}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          ) : message ? (
            <p
              className={
                message.tone === "error" ? styles.errorText : styles.successText
              }
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ImpactPanel;
