const StaticAdjust = (props) => {
  return (
    <>
      <div className="row">
        <div className="col">
          <label>Sensor:</label>
          <select
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
            id="sensor_id"
            value={props.selectedSensor}
            onChange={props.handleSensorChange}
            disabled={props.buttonName === "Emergency Stop"}
          >
            {props.createSelector()}
          </select>
        </div>
        <div className="col">
          <label>Setpoint:</label>
          <div className="input-group">
            <input
              type="number"
              id="setpoint"
              className="form-control form-control-lg"
              min="-9999"
              max="9999"
              step="1.0"
              value={props.setPoint ==undefined ? 0 : props.setPoint} // Ensure a defined initial value or use an empty string if it's undefined
              onChange={props.handleSetPointChange}
              // disabled={props.buttonName === "Emergency Stop" || props.custom_preset_toggle === "Preset"}
              disabled={true}
              // disabled={!(props.custom_preset_toggle === "Custom" && props.buttonName === "Start" && props.selectedTest !== null)}
            />
          </div>
        </div>
        <div className="col">
          <label>Hold time:</label>
          <div className="input-group">
            <input
              type="text" inputMode="numeric"
              id="holdtime"
              className="form-control form-control-lg"
              min="0"
              value={props.holdTime ==undefined ? 0 : props.holdTime}
              onChange={props.handleHoldTimeChange}
              // disabled={props.buttonName === "Emergency Stop" || props.custom_preset_toggle === "Preset"}
              disabled={true}
              // disabled={!(props.custom_preset_toggle === "Custom" && props.buttonName === "Start" && props.selectedTest !== null)}

            />
            <span className="input-group-text" >s</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticAdjust;
