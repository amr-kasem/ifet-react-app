const DynamicAdjust = (props) => {
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 col-xl-3 mt-3">
          <label>Sensor:</label>
          <select
              className="form-select form-select-lg"
              aria-label=".form-select-lg example"
              id="sensor_id"
              value={props.selectedSensor}
              onChange={props.handleSensorChange}
              disabled={props.buttonName === "Emergency Stop" || props.buttonName === "Resume"}
            >
              {props.createSelector()}
            </select>
        </div>
        <div className="col-12 col-md-6 col-xl-3 mt-3">
          <label>Number of cycles:</label>
          <div className="input-group">
            <input
              type="text" inputMode="numeric"
              id="count"
              className="form-control form-control-lg"
              min="0"
              value={props.NumberOfCycles}
              onChange={props.handleNumberOfCyclesChange}
              // disabled={props.buttonName === "Emergency Stop" || props.buttonName === "Resume"  || props.custom_preset_toggle === "Preset"}
              disabled={true}
              // disabled={!(props.custom_preset_toggle === "Custom" && props.buttonName === "Start" && props.selectedTest !== null)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3 mt-3">
          <label>High Pressure:</label>
          <div className="input-group">
            <input
              type="number"
              id="positive"
              className="form-control form-control-lg"
              min="-9999"
              max="9999"
              value={props.PositiveSetPoint}
              onChange={props.handlePositiveSetPointChange}
              // disabled={props.buttonName === "Emergency Stop" || props.buttonName === "Resume"  || props.custom_preset_toggle === "Preset"}
              disabled={true}
              // disabled={!(props.custom_preset_toggle === "Custom" && props.buttonName === "Start" && props.selectedTest !== null)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3 mt-3">
          <label>Low Pressure:</label>
          <div className="input-group">
            <input
              type="number"
              id="negative"
              className="form-control form-control-lg"
              value={props.NegativeSetPoint}
              onChange={props.handleNegativeSetPointChange}
              // disabled={props.buttonName === "Emergency Stop" || props.buttonName === "Resume"  || props.custom_preset_toggle === "Preset"}
              disabled={true}
              // disabled={!(props.custom_preset_toggle === "Custom" && props.buttonName === "Start" && props.selectedTest !== null)}
              min="-9999"
              max="9999"
            />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default DynamicAdjust;
