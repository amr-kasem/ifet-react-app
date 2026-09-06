import React, { useEffect, useState } from "react";
import Information from "../tablesForm/Information";
// import Adjust from "../static_load/adjust";
import Adjust from "../adjustForm/adjust";
import Status from "../Status/status";
import DeviceHeader from "./deviceHeader";
import styles from "./device.module.css"; // Import CSS module
import backgroundImage from "../../images/turbo.png";

const Device = (props) => {
  const { device, devicesNames } = props;
  const [projectID, setProjectId] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fetchProjects, setFetchProjects] = useState(null); // Add state for fetchProjects

  useEffect(() => {
    if (device.turbo_disable === true || device.turbo_disable === false) {
      setIsDisabled(device.turbo_disable);
    }
  }, [device.turbo_disable]);

  return (
    <div className={styles.container}>
      <div className={`card mt-3 mb-3 ${styles.card}`}>
        {/* DeviceHeader remains interactive */}
        <div className={`card-header pt-3 ${styles.cardHeader}`}>
          <DeviceHeader
            deviceID={device.deviceID}
            status={device.status}
            devicesNames={devicesNames}
            isDisabled={isDisabled}
          />
        </div>

        {isDisabled ? (
          <div className={styles.disabled}>
            <h3 className={styles.title}>Device in Slave mode now</h3>
            {/* valves only */}
            <Status
              deviceData={device}
              showStatus={false}
              showSensors={false}
              showOthers={false}
              className={styles.fullWidth} // Apply the fullWidth class
            />
            <div className={styles.imageContainer}>
              <div className={styles.currentSpeedContainer}>
                <h4 style={{ color: "red" }}>Current Speed</h4>
                <i id="currentSpeed">{device.current_speed}</i>
              </div>
              <img
                src={backgroundImage}
                alt="Device Background"
                className={styles.deviceImage}
              />
            </div>
          </div>
        ) : (
          <div className="col card-body">
            <div className="row">
              <Adjust deviceID={device.deviceID} projectID={projectID} fetchProjects={fetchProjects}/>
              <Status deviceData={device} />
            </div>
            <hr />
            <div className="row">
              <Information
                deviceID={device.deviceID}
                setProjectId={setProjectId}
                setFetchProjects={setFetchProjects}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Device;
