import React, { useEffect, useState } from "react";
import styles from "./ImpactFinishModal.module.css";

// The reasons the API sees for a stopped attempt. Free text is allowed too.
const ABORT_REASONS = [
  "Equipment Fault",
  "Specimen Fault",
  "Operator Error",
  "Environmental",
];

// ONE ATTEMPT IS ONE IMPACT, so this closes one impact rather than a sequence.
//
// There is deliberately no "did the specimen resist?" question any more. The
// attempt's outcome IS its impact's outcome — the backend derives it from the
// shot at finish — so asking again could only produce a contradiction: a Fail
// impact inside an attempt the operator marked as resisted. The result was
// meaningful when an attempt summarised several impacts; it no longer is.
const ImpactFinishModal = ({
  visible,
  impactNumber,
  shot,
  photoCount,
  busy,
  onCancel,
  onSubmit,
}) => {
  const [mode, setMode] = useState("complete"); // complete | abort
  const [note, setNote] = useState("");
  const [testingContinued, setTestingContinued] = useState("Stopped");
  const [abortReason, setAbortReason] = useState(ABORT_REASONS[0]);

  useEffect(() => {
    if (!visible) return;
    setMode("complete");
    setNote("");
    setTestingContinued("Stopped");
    setAbortReason(ABORT_REASONS[0]);
  }, [visible]);

  if (!visible) return null;

  // Exactly one impact and at least one photograph — the backend's two gates.
  const canComplete = !!shot && photoCount > 0;

  const submit = () => {
    if (mode === "abort") {
      onSubmit({ abort_reason: abortReason, note: note || null });
      return;
    }
    // No `result`: the outcome comes from the impact itself.
    onSubmit({
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
        <h3 className={styles.title}>
          {mode === "abort" ? "Abort" : "Complete"} impact {impactNumber}
        </h3>

        <div className={styles.summary}>
          <span className={!shot ? styles.summaryFail : undefined}>
            <strong>
              {shot ? (shot.result ? "Pass" : "Fail") : "no impact"}
            </strong>{" "}
            recorded
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
            <p className={styles.question}>
              This impact is recorded as{" "}
              <strong>
                {shot ? (shot.result ? "Pass" : "Fail") : "nothing yet"}
              </strong>
              . That is the attempt's result — it is not asked again.
            </p>

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
                {!shot
                  ? "Record the impact with Success or Fail before completing it."
                  : "At least one photograph is required before completing."}
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
              An aborted attempt is kept and needs no impact or photograph.
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
          The reviewer decides Pass / Fail afterwards. This impact stays
          <strong> Pending</strong> review until then. A mis-recorded result
          cannot be edited — it is superseded by a correction.
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
            {mode === "abort" ? "Abort Impact" : "Complete Impact"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactFinishModal;
