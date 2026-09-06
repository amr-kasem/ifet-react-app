// AddRowCyclicPressureLoadingModal.js
import React from "react";
import styles from "./AddRowPressureLoadingModal.module.css"; // reuse same CSS

const AddRowCyclicPressureLoadingModal = ({
  newRowData,
  setNewRowData,
  isValid,
  onCancel,
  onSave,
}) => {
  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modalWrapper} style={{ width: "auto", minWidth: "500px" }}>
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Add Custom Row</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Loading Direction</label>
              <select
                className="form-select"
                value={newRowData.type}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    type: e.target.value,
                  })
                }
              >
                <option value="inward">Inward</option>
                <option value="outward">Outward</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Low Pressure</label>
              <input
                type="number"
                className="form-control"
                value={newRowData.low_pressure}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    low_pressure: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">High Pressure</label>
              <input
                type="number"
                className="form-control"
                value={newRowData.high_pressure}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    high_pressure: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Cycles</label>
              <input
                type="number"
                className="form-control"
                value={newRowData.cycles}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    cycles: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" disabled={!isValid} onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRowCyclicPressureLoadingModal;
