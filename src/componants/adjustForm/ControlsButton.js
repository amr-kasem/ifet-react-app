import axios from "axios";

const ControlsButton = ({
  deviceID,
  buttonClass,
  handleStartBtn,
  buttonName,
  status,
  selectedSensor,
  ref3,
  disabled,
  customPresetToggle,
  project_id,
  cyclic_test_index,
  setButtonName,
  setButtonClass,
}) => {
  // console.log("checking button" , "disabled = ",disabled , "selectedSensor = ", selectedSensor)
  // console.log("CANCEL test",project_id)

  return (
    <div className="row pt-3">
      <div className="col">
        <button
          type="button"
          style={{ width: "100%" }}
          className={buttonClass}
          id="startBtn1"
          onClick={handleStartBtn}
          disabled={
            customPresetToggle === "Custom" // Ignore disabled if "Custom"
              ? buttonName === "Start" &&
                (status !== "idle" || selectedSensor === 0)
              : disabled || selectedSensor === 0 // Include the disabled prop in the condition otherwise
          }
        >
          {buttonName}
        </button>
      </div>

      {/* Display the cancel button only when buttonName is "Resume" */}

      {buttonName === "Resume" && (
        <div className="col">
          <button
            type="button"
            style={{ width: "100%" }}
            className="btn btn-danger btn-lg"
            id="startBtn2"
            onClick={() => {
              console.log("Cancel Resume");
              // ref3.current.mqttPub({
              //   topic: `device${deviceID}/resume_cancel`,
              //   qos: 1,
              //   payload: "cancel",
              // });

              // don't send mqtt instead call api ("/projects/{project_id}/cyclic_tests/{cyclic_test_index}/update_status")
              // PUT request with data
              // {
              //       'current_cycle': current_cycle,
              // }

              // status = Cycle 4 High Stroke
              let current_cycle = 0; // lsa msh 3arf meen el cycle
              // if (status.includes("Cycle")){
              //   current_cycle = status.split(" ")[1]
              // }
              // let payload = { 'current_cycle': current_cycle };
              axios
                .put(
                  `http://${window.location.hostname}:8000/projects/${project_id}/cyclic_tests/${cyclic_test_index}/reset`,
                  {
                    headers: { "Content-Type": "application/json" },
                  }
                )
                .then((response) => {
                  console.log("Cancel response:", response.data);
                  if (response.data.resume === false) {
                    setButtonName("Start"); //resume new update
                    setButtonClass("btn btn-success btn-lg"); //resume new update
                  }
                })
                .catch((error) => {
                  console.error("There was an error cancel job!", error);
                });
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlsButton;
