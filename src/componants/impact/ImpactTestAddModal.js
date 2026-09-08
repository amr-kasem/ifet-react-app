import React, { useEffect, useState } from "react";
import styles from "./ImpactFinishModal.module.css";

const ImpactTestAddModal = ({ visible, busy, onCancel, onSave }) => {
  const [missile, setMissile] = useState("");
  const [missileWeight, setMissileWeight] = useState("");

  useEffect(() => {
    if (!visible) return;
    setMissile("");
    setMissileWeight("");
  }, [visible]);

  if (!visible) return null;

  const save = () => {
    // Everything is optional here — the protocol fixes the missile, so an
    // empty body is valid. Send only what was actually typed.
    const body = {};
    if (missile.trim()) body.missile = missile.trim();
    if (missileWeight !== "" && !Number.isNaN(Number(missileWeight))) {
      body.missile_weight = Number(missileWeight);
    }
    onSave(body);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>Add Impact Test</h3>

        <label className={styles.label} htmlFor="impact_missile">
          Missile
        </label>
        <input
          id="impact_missile"
          type="text"
          className="form-control"
          placeholder="e.g. 2x4 Large Missile"
          value={missile}
          onChange={(e) => setMissile(e.target.value)}
        />

        <label className={styles.label} htmlFor="impact_missile_weight">
          Missile weight
        </label>
        <input
          id="impact_missile_weight"
          type="number"
          step="0.01"
          min="0"
          className="form-control"
          placeholder="e.g. 9"
          value={missileWeight}
          onChange={(e) => setMissileWeight(e.target.value)}
        />

        <p className={styles.aside}>
          Both are optional — the test protocol fixes the missile, so a test
          with neither is valid. Attempts are started from the control panel
          once the test exists.
        </p>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={save}
            disabled={busy}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactTestAddModal;
