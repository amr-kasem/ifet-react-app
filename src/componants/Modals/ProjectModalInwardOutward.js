import React, { useState, useEffect } from "react";

const ProjectModalInwardOutward = ({
  isOpen,
  onClose,
  onSave,
  newProjectName,
  setNewProjectName,
  inwardDesignPressure,
  setInwardDesignPressure,
  outwardDesignPressure,
  setOutwardDesignPressure,
  newParent,
  setNewParent,
  parents,
  hasWaterInfiltration,
  setHasWaterInfiltration,
  projectError,
  setProjectError,
  selectedParent,
}) => {
  // Reset the modal values when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setNewProjectName(""); // Reset project name
      setInwardDesignPressure(""); // Reset inward design pressure
      setOutwardDesignPressure(""); // Reset outward design pressure
      setNewParent(selectedParent || ""); // Set to currently selected parent
      setHasWaterInfiltration(false); // Reset water infiltration checkbox
      setProjectError(""); // Clear any previous errors
      console.log("parents = " , parents)
    }
  }, [isOpen, selectedParent]); // Effect will trigger when `isOpen` or `selectedParent` changes

  const handleSave = () => {
    onSave();
  };

  if (!isOpen) {
    return null; // If modal is not open, return null to not render anything
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ marginTop: "20%" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title">New Project</h5> */}
            {/* namming */}
            <h5 className="modal-title">New Specimen</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {projectError && (
              <div className="alert alert-danger" role="alert">
                {projectError}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">
                Specimen Name
                {/* namming */}
              </label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)} // Handle input change
              />
            </div>

            <div className="mb-3">
              <label htmlFor="inwardDesignPressure" className="form-label">
                Inward Design Pressure
              </label>
              <input
                type="number"
                className="form-control"
                id="inwardDesignPressure"
                placeholder="Enter inward design pressure"
                value={inwardDesignPressure}
                onChange={(e) => setInwardDesignPressure(e.target.value)} // Handle inward design pressure input
              />
            </div>

            <div className="mb-3">
              <label htmlFor="outwardDesignPressure" className="form-label">
                Outward Design Pressure
              </label>
              <input
                type="number"
                className="form-control"
                id="outwardDesignPressure"
                placeholder="Enter outward design pressure"
                value={outwardDesignPressure}
                onChange={(e) => setOutwardDesignPressure(e.target.value)} // Handle outward design pressure input
              />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="Parent" className="form-label"> */}
            {/* Project Parent */}
            {/* namming */}
            {/* Project
              </label>
              <input
                type="text"
                className="form-control"
                id="Parent"
                placeholder="Enter Parent"
                value={newParent}
                onChange={(e) => setNewParent(e.target.value)} // Handle newParent input
              />
            </div> */}

            <div className="mb-3">
              <label htmlFor="Parent" className="form-label">
                Project
              </label>
              <select
                className="form-control"
                id="Parent"
                value={newParent}
                onChange={(e) => setNewParent(e.target.value)}
              >
                <option value="">Select Project</option>
                <option value="legacy">Legacy</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="waterInfiltration"
                  checked={hasWaterInfiltration}
                  onChange={(e) => setHasWaterInfiltration(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="waterInfiltration">
                  Water Infiltration
                </label>
              </div>
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
              {/* Save Project */}
              {/* namming */}
              Save Specimen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModalInwardOutward;
