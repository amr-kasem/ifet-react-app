import React, { useEffect, useState } from "react";
import styles from "./ImpactTestSetup.module.css";
import {
  IMPACT_FAMILIES,
  IMPACT_LEVELS,
  familyIsLocked,
  familyNeedsReimport,
  familyStranded,
  familyUnset,
  impactError,
  impactSetupMissing,
  isAirtableBound,
  levelAndVelocityAreLocked,
  updateImpactTest,
} from "./impactApi";

// The selected impact test's own values: which missile classification it runs
// under, and the velocity it is fired against. Both belong to the TEST, not to
// an impact, and `PUT /test-results/{aid}/finish` refuses a completion without
// them - so they are set here, before the first impact is completed.
//
// THE FAMILY CONTROL'S SHAPE IS REQUIRED (TC5 §4):
//
//   IMPACT_SMI section  -> no family control at all; "SMI", read-only
//   IMPACT_LMI section  -> a required D / E choice, and nothing else
//   LabOS-only test     -> a family choice, write-once
//
// Never a three-option picker on an Airtable-bound test: the SMI/LMI half is
// Airtable's answer, frozen at import, and offering it invites a contradiction
// the API rejects with 400.
const ImpactTestSetup = ({ projectId, test, onChanged }) => {
  const [level, setLevel] = useState("");
  const [family, setFamily] = useState("");
  const [velocity, setVelocity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Re-seed the draft whenever the selected test changes, or the server
  // returns new values for it.
  useEffect(() => {
    setFamily(test?.impact_family || "");
    setLevel(test?.impact_level || "");
    setVelocity(
      test?.target_velocity === null || test?.target_velocity === undefined
        ? ""
        : String(test.target_velocity)
    );
    setError("");
    setSaved(false);
  }, [test?.id, test?.impact_family, test?.impact_level, test?.target_velocity]);

  if (!test) return null;

  const bound = isAirtableBound(test);
  const familyLocked = familyIsLocked(test);
  const valuesLocked = levelAndVelocityAreLocked(test);
  const missing = impactSetupMissing(test);
  const needsFamilyFirst = familyUnset(test) && !bound && !familyLocked;
  const stranded = familyStranded(test);
  const needsReimport = familyNeedsReimport(test);

  // A level applies to LMI only; the API refuses one on an SMI test.
  const showLevel = family === "LMI";

  const dirty =
    family !== (test.impact_family || "") ||
    level !== (test.impact_level || "") ||
    velocity !==
      (test.target_velocity === null || test.target_velocity === undefined
        ? ""
        : String(test.target_velocity));

  const save = async () => {
    // Only send what changed: the update schema refuses unknown keys, and
    // re-sending a locked field would be refused on its own rule.
    const body = {};
    if (!familyLocked && family !== (test.impact_family || "")) {
      body.impact_family = family || null;
    }
    if (!valuesLocked) {
      if (level !== (test.impact_level || "")) {
        body.impact_level = family === "LMI" ? level || null : null;
      }
      const current =
        test.target_velocity === null || test.target_velocity === undefined
          ? ""
          : String(test.target_velocity);
      if (velocity !== current) {
        body.target_velocity = velocity === "" ? null : Number(velocity);
      }
    }
    if (Object.keys(body).length === 0) return;

    try {
      setBusy(true);
      setError("");
      await updateImpactTest(projectId, test.id, body);
      setSaved(true);
      if (onChanged) onChanged();
    } catch (err) {
      // The refusals say which rule was hit - a bound family, or a value
      // changed after an attempt completed.
      setError(impactError(err, "Could not save the test setup."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.heading}>Test setup</h4>
        <span className={styles.testName}>
          Impact test {test.id}
          {test.missile ? ` · ${test.missile}` : ""}
        </span>
        {/* Derived on the server. Rendered, never computed. */}
        <span
          className={
            test.impact_classification
              ? styles.classification
              : styles.classificationMissing
          }
          title="Derived from the family and level by the API"
        >
          {test.impact_classification || "unclassified"}
        </span>
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

      <div className={styles.fields}>
        {/* --- the family ------------------------------------------------- */}
        <div className={styles.field}>
          <span className={styles.label}>Missile family</span>
          {bound ? (
            <span
              className={styles.readOnly}
              title={`Frozen at import from Airtable section ${test.airtable_section_id}`}
            >
              {test.impact_family || "—"}
              <span className={styles.readOnlyNote}>from Airtable</span>
            </span>
          ) : (
            <div className={styles.choice}>
              {IMPACT_FAMILIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={family === f ? styles.choiceOn : styles.choiceOff}
                  onClick={() => {
                    setFamily(f);
                    if (f !== "LMI") setLevel("");
                  }}
                  disabled={familyLocked || busy}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- the level: LMI only, and required for it -------------------- */}
        {showLevel && (
          <div className={styles.field}>
            <span className={styles.label}>
              Level <span className={styles.required}>required</span>
            </span>
            <div className={styles.choice}>
              {IMPACT_LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={level === l ? styles.choiceOn : styles.choiceOff}
                  onClick={() => setLevel(l)}
                  disabled={valuesLocked || busy}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- the target velocity: per TEST, not per impact --------------- */}
        <div className={styles.field}>
          <span className={styles.label}>
            Target velocity <span className={styles.unit}>ft/s</span>
          </span>
          <input
            type="number"
            className={`form-control ${styles.velocity}`}
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
            disabled={valuesLocked || busy}
            placeholder="e.g. 50"
            title="What this test is fired against. The achieved velocity of one impact is recorded on that impact instead."
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={busy || !dirty}
          >
            {busy ? "Saving…" : "Save setup"}
          </button>
        </div>
      </div>

      {/* Two different deadlines, and conflating them is how a test gets
          stranded: the family is fixed by the first ATTEMPT, the level and
          velocity only by the first COMPLETION. */}
      {needsReimport && (
        <p className={styles.stranded}>
          This test is bound to Airtable section{" "}
          <strong>{test.airtable_section_id}</strong> but carries no missile
          family, and the family is that section's to give. Re-run the
          requirement import before starting — the API refuses to start an
          impact without one.
        </p>
      )}

      {stranded && (
        <p className={styles.stranded}>
          This test has attempts but no missile family, so it can never acquire
          one — and an impact with no classification cannot be completed. Its
          impacts can only be aborted. Create a new test and set the family
          before starting.
        </p>
      )}

      {needsFamilyFirst && (
        <p className={styles.needs}>
          Choose the missile family <strong>before the first impact starts</strong>.
          An attempt fixes it permanently, so the API refuses to start one
          without it.
        </p>
      )}

      {!stranded && !needsFamilyFirst && missing.length > 0 && !valuesLocked && (
        <p className={styles.needs}>
          Set {missing.join(" and ")} before <strong>completing</strong> the
          first impact — a completed impact records what it ran under, and the
          API refuses one without it. An aborted impact needs neither.
        </p>
      )}

      {valuesLocked && (
        <p className={styles.locked}>
          An impact has been completed, so the level and target velocity it ran
          under are fixed. A wrong record is superseded by a correction.
        </p>
      )}

      {!valuesLocked && familyLocked && !bound && !stranded && (
        <p className={styles.locked}>
          This test has attempts, so the missile family is fixed — it is the
          context they ran in.
        </p>
      )}

      {saved && !dirty && !error && (
        <p className={styles.saved}>Saved.</p>
      )}
    </div>
  );
};

export default ImpactTestSetup;
