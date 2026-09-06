import styles from "./AddRowPressureLoadingModal.module.css";

const AddRowStaticPressureLoadingModal = ({
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
              <label className="form-label">Pressure</label>
              <input
                type="number"
                className="form-control"
                value={newRowData.pressure}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, pressure: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Holding Time</label>
              <input
                type="number"
                className="form-control"
                value={newRowData.duration}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, duration: e.target.value })
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

export default AddRowStaticPressureLoadingModal;