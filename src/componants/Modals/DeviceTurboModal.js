import React from "react";
import axios from "axios";

const DeviceTurboModal = ({
  deviceID,
  devices,
  onClose,
  setSelectedChoice,
  deviceTurboSelected,
  setErrorMessage,
  handleDeviceTurboSelectedChange,
}) => {
  const handleConfirm = () => {
    const showError = (error) => {
      setErrorMessage(error.response?.data?.detail || error.message);
      setTimeout(() => setErrorMessage(""), 2000); // Clear message after 1 second
    };

    const slave_id = devices.find(
      (device) => device.deviceName === deviceTurboSelected
    )?.deviceID;

    let payload = { slave_id, turbo_mode: true };
    axios
      .put(`http://${window.location.hostname}:8000/devices/${deviceID}/turbo_master`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Turbo response:", response.data);
        setSelectedChoice("Turbo");
        onClose();
      })
      .catch(showError);
  };

  return (
    // <div
    //   style={{
    //     position: "fixed",
    //     top: "50%",
    //     left: "50%",
    //     transform: "translate(-50%, -50%)",
    //     backgroundColor: "white",
    //     padding: "20px",
    //     borderRadius: "8px",
    //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //     zIndex: 1000,
    //   }}
    // >
    //   <h4>Select Turbo Device</h4>
    //   <select
    //     className="form-select form-select-lg"
    //     value={deviceTurboSelected}
    //     onChange={handleDeviceTurboSelectedChange}
    //     style={{ width: "150px" }}
    //   >
    //     {devices.map((device) => (
    //       <option key={device.deviceID} value={device.deviceName}>
    //         {device.deviceName}
    //       </option>
    //     ))}
    //   </select>

    //   <div style={{ marginTop: "20px" }}>
    //     <button onClick={handleConfirm} className="btn btn-primary">
    //       Confirm
    //     </button>
    //     <button
    //       onClick={onClose}
    //       className="btn btn-secondary"
    //       style={{ marginLeft: "10px" }}
    //     >
    //       Cancel
    //     </button>
    //   </div>
    // </div>

    <>
    {/* Backdrop to disable background actions and add opacity */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
        zIndex: 999, // Below the modal
      }}
      onClick={onClose} // Close modal when clicking on the backdrop
    ></div>

    {/* Modal */}
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000, // Above the backdrop
      }}
    >
      <h4>Select Turbo Device</h4>
      <select
        className="form-select form-select-lg"
        value={deviceTurboSelected}
        onChange={handleDeviceTurboSelectedChange}
        style={{ width: "150px" }}
      >
        {devices.map((device) => (
          <option key={device.deviceID} value={device.deviceName}>
            {device.deviceName}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleConfirm} className="btn btn-primary">
          Confirm
        </button>
        <button
          onClick={onClose}
          className="btn btn-secondary"
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  </>
  );
};

export default DeviceTurboModal;
