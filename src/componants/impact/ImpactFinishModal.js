import React, { useEffect, useState } from "react";
import styles from "./ImpactFinishModal.module.css";

// The reasons the API sees for a stopped attempt. Free text is allowed too.
const ABORT_REASONS = [
  "Equipment Fault",
  "Specimen Fault",
  "Operator Error",
  "Environmental",
];

const ImpactFinishModal = ({
  visible,
  shots,
  photoCount,
  busy,
  onCancel,
  onSubmit,
}) => {
  const [mode, setMode] = useState("complete"); // complete | abort
  const [result, setResult] = useState(null); // the operator's call
  const [note, setNote] = useState("");
  const [testingContinued, setTestingContinued] = useState("Stopped");
  const [abortReason, setAbortReason] = useState(ABORT_REASONS[0]);

  useEffect(() => {
    if (!visible) return;
    setMode("complete");
    setNote("");
    setTestingContinued("Stopped");
    setAbortReason(ABORT_REASONS[0]);
    // Deliberately no default: missing data is never a pass, so the operator
    // has to say which it was.
    setResult(null);
  }, [visible]);

  if (!visible) return null;

  const failed = shots.filter((s) => !s.result).length;
  const canComplete = result !== null && shots.length > 0 && photoCount > 0;

  const submit = () => {
    if (mode === "abort") {
      onSubmit({ abort_reason: abortReason, note: note || null });
      return;
    }
    onSubmit({
      result,
      note: note || null,
      testing_continued: testingContinued,
    });
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>Finish Attempt</h3>

        <div className={styles.summary}>
          <span>
            <strong>{shots.length}</strong>{" "}
            {shots.length === 1 ? "impact" : "impacts"} recorded
          </span>
          <span className={failed > 0 ? styles.summaryFail : undefined}>
            <strong>{failed}</strong> failed
          </span>
          <span className={photoCount === 0 ? styles.summaryFail : undefined}>
            <strong>{photoCount}</strong>{" "}
            {photoCount === 1 ? "photograph" : "photographs"}
          </span>
        </div>

        <div className={styles.modeRow}>
          <button
            type="button"
            className={mode === "complete" ? styles.modeOn : styles.modeOff}
            onClick={() => setMode("complete")}
          >
            Complete
          </button>
          <button
            type="button"
            className={mode === "abort" ? styles.modeOn : styles.modeOff}
            onClick={() => setMode("abort")}
          >
            Abort
          </button>
        </div>

        {mode === "complete" ? (
          <>
            <p className={styles.question}>Did the specimen resist?</p>
            <div className={styles.resultRow}>
              <button
                type="button"
                className={
                  result === true ? styles.resistedOn : styles.resistedOff
                }
                onClick={() => setResult(true)}
              >
                It resisted
              </button>
              <button
                type="button"
                className={result === false ? styles.failedOn : styles.failedOff}
                onClick={() => setResult(false)}
              >
                It did not
              </button>
            </div>

            <label className={styles.label} htmlFor="impact_continued">
              Testing continued
            </label>
            <select
              id="impact_continued"
              className="form-select"
              value={testingContinued}
              onChange={(e) => setTestingContinued(e.target.value)}
            >
              <option value="Stopped">Stopped</option>
              <option value="Continued">Continued</option>
            </select>

            {!canComplete && (
              <p className={styles.blocked}>
                {shots.length === 0
                  ? "Record at least one impact before finishing."
                  : photoCount === 0
                  ? "At least one photograph is required before finishing."
                  : "Choose whether the specimen resisted."}
              </p>
            )}
          </>
        ) : (
          <>
            <label className={styles.label} htmlFor="impact_abort_reason">
              Reason
            </label>
            <select
              id="impact_abort_reason"
              className="form-select"
              value={abortReason}
              onChange={(e) => setAbortReason(e.target.value)}
            >
              {ABORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <p className={styles.aside}>
              An aborted attempt is kept and needs no impacts or photographs.
            </p>
          </>
        )}

        <label className={styles.label} htmlFor="impact_note">
          Note (optional)
        </label>
        <textarea
          id="impact_note"
          className="form-control"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <p className={styles.aside}>
          The reviewer decides Pass / Fail afterwards. This attempt stays
          <strong> Pending</strong> review until then.
        </p>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={submit}
            disabled={busy || (mode === "complete" && !canComplete)}
          >
            {mode === "abort" ? "Abort Attempt" : "Complete Attempt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactFinishModal;
