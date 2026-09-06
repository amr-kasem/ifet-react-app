import React, { useState } from 'react';
import styles from './Report.module.css';

const CyclicModalForm = ({ columns, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    area: '', // Default to empty string or initial value
    velocity: '', // Default to empty string or initial value
    result: 'true', // Default to true (Pass)
    note: '', // Default to empty string or initial value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRow = {
      area: parseFloat(formData.area) || 0, // Ensure it's a number
      velocity: parseFloat(formData.velocity) || 0, // Ensure it's a number
      result: formData.result === 'true', // Convert string to boolean
      note: formData.note || '', // Ensure it's a non-empty string
    };
    onSave(newRow);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Add Row</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Area</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Velocity (ft/s)</label>
            <input
              type="number"
              name="velocity"
              value={formData.velocity}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Result</label>
            <select
              name="result"
              value={formData.result}
              onChange={handleChange}
              required
            >
              <option value="true">Pass</option>
              <option value="false">Fail</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Notes</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CyclicModalForm;
