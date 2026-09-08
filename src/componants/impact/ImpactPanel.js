import React, { useEffect, useRef, useState } from "react";
import ImpactFinishModal from "./ImpactFinishModal";
import ImpactPhotosModal from "./ImpactPhotosModal";
import styles from "./ImpactPanel.module.css";
import {
  finishAttempt,
  impactError,
  listShots,
  recordShot,
  uploadPhotos,
} from "./impactApi";

const ImpactPanel = ({
  attempt,
  setAttempt,
  operatorName,
  setOperatorName,
  onAttemptClosed,
}) => {
  const filesInputRef = useRef();
  const folderInputRef = useRef();
  const shotFilesInputRef = useRef();
  const photoTargetRef = useRef(null); // shot awaiting photos, or null

  const [shots, setShots] = useState([]);
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
    setTimeout(() => setMessage(null), 5000);
  };

  const loadShots = async (attemptId) => {
    if (!attemptId) {
      setShots([]);
      return;
    }
    try {
      setShots(await listShots(attemptId));
    } catch (error) {
      console.error("Could not load impacts", error);
    }
  };

  useEffect(() => {
    // shot_id null means attempt-level. The attempt list also carries every
    // shot photo, so filtering here stops the same file appearing twice.
    setAttemptPhotos((attempt?.photos || []).filter((p) => p.shot_id == null));
    loadShots(attempt?.id);
  }, [attempt?.id]);

  const inProgress = attempt?.status === "In Progress";
  const evidenceOpen = attempt?.test_result === "Pending";
  const photoCount =
    attemptPhotos.length +
    shots.reduce((n, s) => n + (s.photos?.length || 0), 0);

  const handleRecordShot = async (result) => {
    try {
      setBusy(true);
      const shot = await recordShot(attempt.id, { result });
      await loadShots(attempt.id);
      flash(
        `Impact ${shot.shot_number} recorded as ${result ? "PASS" : "FAIL"}.`,
        "success"
      );
    } catch (error) {
      flash(impactError(error, "Could not record the impact."), "error");
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

    try {
      setProgress(0);
      // One request per photograph — that is what the API accepts.
      const { saved, failed } = await uploadPhotos(
        target ? { shotId: target.id } : { attemptId: attempt.id },
        images,
        setProgress
      );

      if (target) {
        await loadShots(attempt.id);
      } else {
        setAttemptPhotos((prev) => [...prev, ...saved]);
      }

      const where = target ? `impact ${target.shot_number}` : "the attempt";
      const skipped = picked.length - images.length;
      const parts = [
        `${saved.length} photograph${saved.length === 1 ? "" : "s"} added to ${where}`,
      ];
      if (skipped > 0) parts.push(`${skipped} non-image skipped`);
      if (failed.length > 0) parts.push(`${failed.length} failed: ${failed[0].reason}`);

      flash(`${parts.join(" — ")}.`, failed.length > 0 ? "error" : "success");
    } catch (error) {
      flash(impactError(error, "Upload failed."), "error");
    } finally {
      setProgress(null);
    }
  };

  const pickPhotosForShot = (shot) => {
    photoTargetRef.current = shot;
    shotFilesInputRef.current?.click();
  };

  const handleFinish = async (body) => {
    try {
      setBusy(true);
      const updated = await finishAttempt(attempt.id, body);
      setShowFinish(false);
      setAttempt(updated);
      flash(
        updated.status === "Aborted"
          ? `Attempt aborted — ${updated.abort_reason}.`
          : `Attempt ${updated.trial_number} completed. Awaiting review.`,
        "success"
      );
      if (onAttemptClosed) onAttemptClosed(updated);
    } catch (error) {
      // The detail says what is missing — an impact, or a photograph.
      flash(impactError(error, "Could not finish the attempt."), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <ImpactFinishModal
        visible={showFinish}
        shots={shots}
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
            disabled={!!attempt}
            title="A declared name, not a login. Remembered for this device."
          />
          {attempt && (
            <span className={styles.attemptBadge}>
              Attempt {attempt.trial_number} · {attempt.status}
            </span>
          )}
        </div>

        <div className={styles.resultRow}>
          <button
            type="button"
            className={`btn btn-success btn-lg ${styles.resultButton}`}
            onClick={() => handleRecordShot(true)}
            disabled={!inProgress || busy}
          >
            Success
          </button>
          <button
            type="button"
            className={`btn btn-danger btn-lg ${styles.resultButton}`}
            onClick={() => handleRecordShot(false)}
            disabled={!inProgress || busy}
          >
            Fail
          </button>
        </div>

        <p className={styles.hint}>
          {inProgress
            ? "Each press records one impact. Photograph each one, then finish the attempt."
            : attempt
            ? `This attempt is ${attempt.status.toLowerCase()}. Press Start for a new attempt.`
            : "Select an impact test and press Start to begin an attempt."}
        </p>

        {shots.length > 0 && (
          <div className={styles.shotList}>
            {shots.map((shot) => (
              <div key={shot.id} className={styles.shotRow}>
                <span className={styles.shotNumber}>#{shot.shot_number}</span>
                <span className={shot.result ? styles.shotPass : styles.shotFail}>
                  {shot.result ? "Pass" : "Fail"}
                </span>
                <span className={styles.shotPhotos}>
                  {shot.photos?.length || 0}{" "}
                  {(shot.photos?.length || 0) === 1 ? "photo" : "photos"}
                </span>
                <button
                  type="button"
                  className={styles.shotAddPhoto}
                  onClick={() => pickPhotosForShot(shot)}
                  disabled={progress !== null || !evidenceOpen}
                >
                  + Photos
                </button>
              </div>
            ))}
          </div>
        )}

        <hr className={styles.divider} />

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
            disabled={!attempt || progress !== null || !evidenceOpen}
            title="Attempt-level evidence — the specimen before, the overall setup"
          >
            Upload Images
          </button>
          <button
            type="button"
            className={`btn btn-light ${styles.uploadButton}`}
            onClick={() => folderInputRef.current?.click()}
            disabled={!attempt || progress !== null || !evidenceOpen}
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

        {inProgress && (
          <div className={styles.finishRow}>
            <button
              type="button"
              className={`btn btn-primary ${styles.finishButton}`}
              onClick={() => setShowFinish(true)}
              disabled={busy}
            >
              Finish Attempt
            </button>
          </div>
        )}

        {message && (
          <p
            className={
              message.tone === "error" ? styles.errorText : styles.successText
            }
          >
            {message.text}
          </p>
        )}
      </div>
    </>
  );
};

export default ImpactPanel;
