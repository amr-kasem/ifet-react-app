import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { devicesActions } from "../../store/sensors-slice";
import StaticPressureTableRowCustom from "./StaticPressureTableRowCustom";

const StaticPressureTableCustom = (props) => {
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find(
    (device) => device.deviceID === props.neededDevice.deviceID
  );

  const [Sequance1Pressure, setSequance1Pressure] = useState(0);
  const [Sequance1Duration, setSequance1Duration] = useState(0);
  const [Sequance2Pressure, setSequance2Pressure] = useState(0);
  const [Sequance2Duration, setSequance2Duration] = useState(0);
  const [Sequance3Pressure, setSequance3Pressure] = useState(0);
  const [Sequance3Duration, setSequance3Duration] = useState(0);
  const [Sequance4Pressure, setSequance4Pressure] = useState(0);
  const [Sequance4Duration, setSequance4Duration] = useState(0);
  const [Sequance5Pressure, setSequance5Pressure] = useState(0);
  const [Sequance5Duration, setSequance5Duration] = useState(0);
  const [Sequance6Pressure, setSequance6Pressure] = useState(0);
  const [Sequance6Duration, setSequance6Duration] = useState(0);

  const [Sequance1Finished, setSequance1Finished] = useState("");
  const [Sequance2Finished, setSequance2Finished] = useState("");
  const [Sequance3Finished, setSequance3Finished] = useState("");
  const [Sequance4Finished, setSequance4Finished] = useState("");
  const [Sequance5Finished, setSequance5Finished] = useState("");
  const [Sequance6Finished, setSequance6Finished] = useState("");

  function updateStaticTable() {
    // console.log("neededdevice",neededDevice)
    setSequance1Pressure(neededDevice.static_index_1_pressure);
    setSequance1Duration(neededDevice.static_index_1_duration);
    setSequance2Pressure(neededDevice.static_index_2_pressure);
    setSequance2Duration(neededDevice.static_index_2_duration);
    setSequance3Pressure(neededDevice.static_index_3_pressure);
    setSequance3Duration(neededDevice.static_index_3_duration);
    setSequance4Pressure(neededDevice.static_index_4_pressure);
    setSequance4Duration(neededDevice.static_index_4_duration);
    setSequance5Pressure(neededDevice.static_index_5_pressure);
    setSequance5Duration(neededDevice.static_index_5_duration);
    setSequance6Pressure(neededDevice.static_index_6_pressure);
    setSequance6Duration(neededDevice.static_index_6_duration);

    setSequance1Finished(neededDevice.static_index_1_finished);
    setSequance2Finished(neededDevice.static_index_2_finished);
    setSequance3Finished(neededDevice.static_index_3_finished);
    setSequance4Finished(neededDevice.static_index_4_finished);
    setSequance5Finished(neededDevice.static_index_5_finished);
    setSequance6Finished(neededDevice.static_index_6_finished);
  }
  useEffect(() => {
    console.log("i will update now");
    updateStaticTable();
  }, [
    neededDevice.design_load_positive,
    neededDevice.design_load_negative,
    neededDevice.static_index_1_finished,
    neededDevice.static_index_2_finished,
    neededDevice.static_index_3_finished,
    neededDevice.static_index_4_finished,
    neededDevice.static_index_5_finished,
    neededDevice.static_index_6_finished,
    neededDevice.CyclicTests,
    neededDevice.StaticTests,
  ]);

  const dispatch = useDispatch();

  const status = props.neededDevice.status;

  useEffect(() => {
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.neededDevice.deviceID,
        current_index: 0,
      })
    );
  }, []);

  const handleInputChange = (newValue, fieldName) => {
    switch (fieldName) {
      case "Sequance1Pressure":
        setSequance1Pressure(newValue);
        break;
      case "Sequance1Duration":
        setSequance1Duration(newValue);
        break;
      case "Sequance2Pressure":
        setSequance2Pressure(newValue);
        break;
      case "Sequance2Duration":
        setSequance2Duration(newValue);
        break;
      case "Sequance3Pressure":
        setSequance3Pressure(newValue);
        break;
      case "Sequance3Duration":
        setSequance3Duration(newValue);
        break;
      case "Sequance4Pressure":
        setSequance4Pressure(newValue);
        break;
      case "Sequance4Duration":
        setSequance4Duration(newValue);
        break;
      case "Sequance5Pressure":
        setSequance5Pressure(newValue);
        break;
      case "Sequance5Duration":
        setSequance5Duration(newValue);
        break;
      case "Sequance6Pressure":
        setSequance6Pressure(newValue);
        break;
      case "Sequance6Duration":
        setSequance6Duration(newValue);
        break;

      default:
        break;
    }
  };

  const handleSaveEditClick = () => {
    console.log("reach");
    if (props.isEditable) {
      axios
        .put(
          `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests`,
          [
            {
              index: 0,
              duration: Sequance1Duration,
              pressure: Sequance1Pressure,
              type: "inward",
              // pressure_factor: "Structural Pressure",
            },
            {
              index: 1,
              duration: Sequance2Duration,
              pressure: Sequance2Pressure,
              type: "inward",
              // pressure_factor: "Structural Pressure",
            },
            {
              index: 2,
              duration: Sequance3Duration,
              pressure: Sequance3Pressure,
              type: "inward",
              // pressure_factor: "Structural Pressure",
            },
            {
              index: 3,
              duration: Sequance4Duration,
              pressure: Sequance4Pressure,
              type: "outward",
              // pressure_factor: "Structural Pressure",
            },
            {
              index: 4,
              duration: Sequance5Duration,
              pressure: Sequance5Pressure,
              type: "outward",
              // pressure_factor: "Structural Pressure",
            },
            {
              index: 5,
              duration: Sequance6Duration,
              pressure: Sequance6Pressure,
              type: "outward",
              // pressure_factor: "Structural Pressure",
            },
          ],
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // props.setProjectData(response.data); //new
          console.log("Data saved successfully", response.data);

          // sync adjust combo box
          let static_tests_sorted = response.data.static_tests.sort(
            (a, b) => a.index - b.index
          );
          dispatch(
            devicesActions.readStaticTestsList({
              deviceID: props.neededDevice.deviceID,
              value: static_tests_sorted,
            })
          );
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error saving data:", error.response.data);
          } else {
            console.error("Error saving data:", error.message);
          }
        });
      props.setIsEditable(!props.isEditable); // Toggle the editable state
    } else {
      props.setIsEditable(!props.isEditable); // Toggle the editable state
    }
  };

  useEffect(() => {
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.neededDevice.deviceID,
        static_index_1_pressure: Sequance1Pressure,
        static_index_1_duration: Sequance1Duration,
        static_index_2_pressure: Sequance2Pressure,
        static_index_2_duration: Sequance2Duration,
        static_index_3_pressure: Sequance3Pressure,
        static_index_3_duration: Sequance3Duration,
        static_index_4_pressure: Sequance4Pressure,
        static_index_4_duration: Sequance4Duration,
        static_index_5_pressure: Sequance5Pressure,
        static_index_5_duration: Sequance5Duration,
        static_index_6_pressure: Sequance6Pressure,
        static_index_6_duration: Sequance6Duration,
        static_index_1_finished: Sequance1Finished,
        static_index_2_finished: Sequance2Finished,
        static_index_3_finished: Sequance3Finished,
        static_index_4_finished: Sequance4Finished,
        static_index_5_finished: Sequance5Finished,
        static_index_6_finished: Sequance6Finished,
      })
    );
  }, [
    Sequance1Pressure,
    Sequance1Duration,
    Sequance2Pressure,
    Sequance2Duration,
    Sequance3Pressure,
    Sequance3Duration,
    Sequance4Pressure,
    Sequance4Duration,
    Sequance5Pressure,
    Sequance5Duration,
    Sequance6Pressure,
    Sequance6Duration,
    Sequance1Finished,
    Sequance2Finished,
    Sequance3Finished,
    Sequance4Finished,
    Sequance5Finished,
    Sequance6Finished,
    props.designLoadPositive,
    props.designLoadNegative,
  ]);

  return (
    <>
      <div className="row">
        <div className="col-6 col-md-5 col-lg-4 mt-3">
          <h4>{props.type} Pressure Loading</h4>
        </div>

        <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
          <button
            type="button"
            className={`btn btn-lg me-2 ${
              props.isEditable ? "btn-danger" : "btn-primary"
            }`}
            disabled={status !== "idle"}
            id="NewPr"
            onClick={handleSaveEditClick}
          >
            {props.isEditable ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="row">
            <div className="table-responsive">
              <table
                className="table text-center table-bordered align-middle"
                style={{
                  tableLayout: "fixed",
                  // width: 'fit-content'
                }}
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "87px" }}>
                      <h6>Loading Sequance</h6>
                    </th>
                    <th style={{ width: "82px" }}>
                      <h6>Loading direction</h6>
                    </th>
                    <th style={{ width: "250px" }}>
                      <h6>Pressure</h6>
                    </th>
                    <th style={{ width: "79px" }}>
                      <h6>Holding time</h6>
                    </th>
                    {/* <th style={{ width: "61px" }}>
                      <h6>Execute Test</h6>
                    </th> */}
                    <th style={{ width: "61px" }}>
                      <h6>Finished</h6>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <StaticPressureTableRowCustom
                    sequenceNumber={1}
                    loadingDirection="inward"
                    pressure={Sequance1Pressure}
                    duration={Sequance1Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance1Finished}
                  />
                  <StaticPressureTableRowCustom
                    sequenceNumber={2}
                    loadingDirection="inward"
                    pressure={Sequance2Pressure}
                    duration={Sequance2Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance2Finished}
                  />
                  <StaticPressureTableRowCustom
                    sequenceNumber={3}
                    loadingDirection="inward"
                    pressure={Sequance3Pressure}
                    duration={Sequance3Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance3Finished}
                  />

                  <StaticPressureTableRowCustom
                    sequenceNumber={4}
                    loadingDirection="outward"
                    pressure={Sequance4Pressure}
                    duration={Sequance4Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance4Finished}
                  />

                  <StaticPressureTableRowCustom
                    sequenceNumber={5}
                    loadingDirection="outward"
                    pressure={Sequance5Pressure}
                    duration={Sequance5Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance5Finished}
                  />

                  <StaticPressureTableRowCustom
                    sequenceNumber={6}
                    loadingDirection="outward"
                    pressure={Sequance6Pressure}
                    duration={Sequance6Duration}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    status={status}
                    finished={Sequance6Finished}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticPressureTableCustom;
