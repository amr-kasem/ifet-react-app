import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { generalActions } from "../../store/general-slice";
import classes from './CommonSensorsSelector.module.css'

const CommonSensorsSelector = ({ onDone , closeModal }) => {
  const dispatch = useDispatch();
  // const sensors = useSelector((state) => state.devices.commonSensors);

  const liveSensors = useSelector((state) => state.devices.commonSensors);
  const [sensors, setSensors] = useState([]);

  React.useEffect(() => {
    if (sensors.length === 0 && liveSensors.length > 0) {
      setSensors(liveSensors); // Freeze on first load
    }
  }, [liveSensors, sensors]);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSensor = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sid) => sid !== id)
        : [...prevSelected, id]
    );
  };

  const handleSubmit = () => {
    dispatch(generalActions.setCommonSensorsTableDisable({ value: true }));
    dispatch(generalActions.setStartAfterSensorSelection({ value: true }));
    dispatch(generalActions.setDevicesDisabled({ value: true }));

    dispatch(generalActions.setSelectedCommonSensorIDs(selectedIds));
    console.log("Selected Sensors from checkboxes:", selectedIds);
    if (onDone) onDone();
  };

  return (


    <div className="p-3">
  <label className="form-label fw-bold">Select Sensors</label>
  <div
    style={{
      maxHeight: "250px",
      overflowY: "auto",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      backgroundColor: "#f8f9fa",
    }}
  >
    <div className="d-flex flex-wrap gap-2">
      {/* {console.log(sensors)} */}
      {sensors.map((sensor) => {
        const isSelected = selectedIds.includes(sensor.ID);
        const isDisabled = sensor.assignedTo !== "free";

        return (
          <button
            key={sensor.ID}
            type="button"
            className={`btn ${classes.pillBtn} ${
              isSelected ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => !isDisabled && toggleSensor(sensor.ID)}
            disabled={isDisabled}
          >
            {sensor.ID}
            {isDisabled && (
              <div className={classes.assignedNote}>
                (assigned to {sensor.assignedTo})
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>

  {/* <button
    onClick={handleSubmit}
    className="btn btn-success mt-3"
    style={{ width: "100%" }}
  >
    Done
  </button> */}

<div className="d-flex justify-content-between mt-3">
  <button
    onClick={handleSubmit}
    className="btn btn-success"
    style={{ width: "48%" }}
  >
    Done
  </button>

  <button
    onClick={closeModal}
    className="btn btn-secondary"
    style={{ width: "48%" , backgroundColor:"darkorange"}}
  >
    Cancel
  </button>


</div>




</div>

  );
};

export default CommonSensorsSelector;
