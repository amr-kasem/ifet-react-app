import React, { useEffect } from "react";

const ParentAddModal = ({
  isOpen,
  onClose,
  onSave,
  newParent,
  setNewParent,
  parentError,
  setParentError,
}) => {
  // Reset the modal values when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setNewParent("");
      setParentError(""); // Clear any previous errors
    }
  }, [isOpen]); // Effect will trigger when `isOpen` changes

  const handleSave = () => {
    onSave();
  };

  if (!isOpen) {
    return null; // If modal is not open, return null to not render anything
  }

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ marginTop: '20%' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title">New Parent</h5> */}
            {/* namming */}
            <h5 className="modal-title">New Project</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {parentError && (
              <div className="alert alert-danger" role="alert">
                {parentError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="Parent" className="form-label">
              {/* Project Parent */}
              {/* namming */}
              Project
              </label>
              <input
                type="text"
                className="form-control"
                id="Parent"
                // placeholder="Enter Parent"
                // namming 
                placeholder="Enter Project"
                value={newParent}
                onChange={(e) => setNewParent(e.target.value)} // Handle selectedParent input
              />
            </div>


          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {/* Save Parent */}
              {/* namming */}
              Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAddModal;
