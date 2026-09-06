import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import axios from "axios";
import CyclicPressureTableRowCustom from "./CyclicPressureTableRowCustom";

const CyclicPressureTableCustom = (props) => {

  const devices = useSelector((state) => state.devices["devices"]);
  
  const neededDevice = devices.find(
    (device) => device.deviceID === props.neededDevice.deviceID
  );

  const [Sequance1AirPressureCycles1, setSequance1AirPressureCycles1] = useState(0);
  const [Sequance1AirPressureCycles2, setSequance1AirPressureCycles2] = useState(0);
  const [Sequance1NumOfCycle, setSequance1NumOfCycle] = useState(3500);
  const [Sequance1Finished, setSequance1Finished] = useState("");

  const [Sequance2AirPressureCycles1, setSequance2AirPressureCycles1] = useState(0);
  const [Sequance2AirPressureCycles2, setSequance2AirPressureCycles2] = useState(0);
  const [Sequance2NumOfCycle, setSequance2NumOfCycle] = useState(300);
  const [Sequance2Finished, setSequance2Finished] = useState("");

  const [Sequance3AirPressureCycles1, setSequance3AirPressureCycles1] = useState(0);
  const [Sequance3AirPressureCycles2, setSequance3AirPressureCycles2] = useState(0);
  const [Sequance3NumOfCycle, setSequance3NumOfCycle] = useState(600);
  const [Sequance3Finished, setSequance3Finished] = useState("");

  const [Sequance4AirPressureCycles1, setSequance4AirPressureCycles1] = useState(0);
  const [Sequance4AirPressureCycles2, setSequance4AirPressureCycles2] = useState(0);
  const [Sequance4NumOfCycle, setSequance4NumOfCycle] = useState(100);
  const [Sequance4Finished, setSequance4Finished] = useState("");

  const [Sequance5AirPressureCycles1, setSequance5AirPressureCycles1] = useState(0);
  const [Sequance5AirPressureCycles2, setSequance5AirPressureCycles2] = useState(0);
  const [Sequance5NumOfCycle, setSequance5NumOfCycle] = useState(50);
  const [Sequance5Finished, setSequance5Finished] = useState("");

  const [Sequance6AirPressureCycles1, setSequance6AirPressureCycles1] = useState(0);
  const [Sequance6AirPressureCycles2, setSequance6AirPressureCycles2] = useState(0);
  const [Sequance6NumOfCycle, setSequance6NumOfCycle] = useState(1050);
  const [Sequance6Finished, setSequance6Finished] = useState("");

  const [Sequance7AirPressureCycles1, setSequance7AirPressureCycles1] = useState(0);
  const [Sequance7AirPressureCycles2, setSequance7AirPressureCycles2] = useState(0);
  const [Sequance7NumOfCycle, setSequance7NumOfCycle] = useState(50);
  const [Sequance7Finished, setSequance7Finished] = useState("");

  const [Sequance8AirPressureCycles1, setSequance8AirPressureCycles1] = useState(0);
  const [Sequance8AirPressureCycles2, setSequance8AirPressureCycles2] = useState(0);
  const [Sequance8NumOfCycle, setSequance8NumOfCycle] = useState(3350);
  const [Sequance8Finished, setSequance8Finished] = useState("");

  function updateTableFirstTime() {
    setSequance1AirPressureCycles1(neededDevice.current_index_1_positive);
    setSequance1AirPressureCycles2(neededDevice.current_index_1_Negative);
    setSequance2AirPressureCycles1(neededDevice.current_index_2_positive);
    setSequance2AirPressureCycles2(neededDevice.current_index_2_Negative);
    setSequance3AirPressureCycles1(neededDevice.current_index_3_positive);
    setSequance3AirPressureCycles2(neededDevice.current_index_3_Negative);
    setSequance4AirPressureCycles1(neededDevice.current_index_4_positive);
    setSequance4AirPressureCycles2(neededDevice.current_index_4_Negative);
    setSequance5AirPressureCycles1(neededDevice.current_index_5_positive);
    setSequance5AirPressureCycles2(neededDevice.current_index_5_Negative);
    setSequance6AirPressureCycles1(neededDevice.current_index_6_positive);
    setSequance6AirPressureCycles2(neededDevice.current_index_6_Negative);
    setSequance7AirPressureCycles1(neededDevice.current_index_7_positive);
    setSequance7AirPressureCycles2(neededDevice.current_index_7_Negative);
    setSequance8AirPressureCycles1(neededDevice.current_index_8_positive);
    setSequance8AirPressureCycles2(neededDevice.current_index_8_Negative);

    setSequance1NumOfCycle(neededDevice.current_index_1_cycles);
    setSequance2NumOfCycle(neededDevice.current_index_2_cycles);
    setSequance3NumOfCycle(neededDevice.current_index_3_cycles);
    setSequance4NumOfCycle(neededDevice.current_index_4_cycles);
    setSequance5NumOfCycle(neededDevice.current_index_5_cycles);
    setSequance6NumOfCycle(neededDevice.current_index_6_cycles);
    setSequance7NumOfCycle(neededDevice.current_index_7_cycles);
    setSequance8NumOfCycle(neededDevice.current_index_8_cycles);

    setSequance1Finished(neededDevice.current_index_1_finished);
    setSequance2Finished(neededDevice.current_index_2_finished);
    setSequance3Finished(neededDevice.current_index_3_finished);
    setSequance4Finished(neededDevice.current_index_4_finished);
    setSequance5Finished(neededDevice.current_index_5_finished);
    setSequance6Finished(neededDevice.current_index_6_finished);
    setSequance7Finished(neededDevice.current_index_7_finished);
    setSequance8Finished(neededDevice.current_index_8_finished);
  }

  useEffect(() => {
    console.log("reatched effect")
    console.log(neededDevice)
    updateTableFirstTime();
  }, [
    // props.designLoadPositive,
    // props.designLoadNegative,
    neededDevice.design_load_positive,
    neededDevice.design_load_negative,
    neededDevice.toggle,
    neededDevice.current_index_1_finished,
    neededDevice.current_index_2_finished,
    neededDevice.current_index_3_finished,
    neededDevice.current_index_4_finished,
    neededDevice.current_index_5_finished,
    neededDevice.current_index_6_finished,
    neededDevice.current_index_7_finished,
    neededDevice.current_index_8_finished,
    neededDevice.CyclicTests,
    neededDevice.StaticTests,
  ]);

  const handleSaveEditClick = () => {
    console.log("reach");
    if (props.isEditable) {
      axios
        .put(
          `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests`,
          [
            {
              index: 0,
              cycles: Sequance1NumOfCycle,
              low_pressure: Sequance1AirPressureCycles2,
              high_pressure: Sequance1AirPressureCycles1,
              type: "inward",
            },
            {
              index: 1,
              cycles: Sequance2NumOfCycle,
              low_pressure: Sequance2AirPressureCycles2,
              high_pressure: Sequance2AirPressureCycles1,
              type: "inward",
            },
            {
              index: 2,
              cycles: Sequance3NumOfCycle,
              low_pressure: Sequance3AirPressureCycles2,
              high_pressure: Sequance3AirPressureCycles1,
              type: "inward",
            },
            {
              index: 3,
              cycles: Sequance4NumOfCycle,
              low_pressure: Sequance4AirPressureCycles2,
              high_pressure: Sequance4AirPressureCycles1,
              type: "inward",
            },
            {
              index: 4,
              cycles: Sequance5NumOfCycle,
              low_pressure: Sequance5AirPressureCycles2,
              high_pressure: Sequance5AirPressureCycles1,
              type: "outward",
            },
            {
              index: 5,
              cycles: Sequance6NumOfCycle,
              low_pressure: Sequance6AirPressureCycles2,
              high_pressure: Sequance6AirPressureCycles1,
              type: "outward",
            },
            {
              index: 6,
              cycles: Sequance7NumOfCycle,
              low_pressure: Sequance7AirPressureCycles2,
              high_pressure: Sequance7AirPressureCycles1,
              type: "outward",
            },
            {
              index: 7,
              cycles: Sequance8NumOfCycle,
              low_pressure: Sequance8AirPressureCycles2,
              high_pressure: Sequance8AirPressureCycles1,
              type: "outward",
            },
          ],
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          props.setProjectData(response.data);
          console.log("Data saved successfully", response.data);

          // sync adjust combo box
          let cyclic_tests_sorted = response.data.cyclic_tests.sort(
            (a, b) => a.index - b.index
          );

          dispatch(
            devicesActions.readCyclicTestsList({
              deviceID: props.neededDevice.deviceID,
              value : cyclic_tests_sorted,
            })
          )

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
      case "Sequance1AirPressureCycles1":
        setSequance1AirPressureCycles1(newValue);
        break;
      case "Sequance1AirPressureCycles2":
        setSequance1AirPressureCycles2(newValue);
        break;
      case "Sequance2AirPressureCycles1":
        setSequance2AirPressureCycles1(newValue);
        break;
      case "Sequance2AirPressureCycles2":
        setSequance2AirPressureCycles2(newValue);
        break;
      case "Sequance3AirPressureCycles1":
        setSequance3AirPressureCycles1(newValue);
        break;
      case "Sequance3AirPressureCycles2":
        setSequance3AirPressureCycles2(newValue);
        break;
      case "Sequance4AirPressureCycles1":
        setSequance4AirPressureCycles1(newValue);
        break;
      case "Sequance4AirPressureCycles2":
        setSequance4AirPressureCycles2(newValue);
        break;
      case "Sequance5AirPressureCycles1":
        setSequance5AirPressureCycles1(newValue);
        break;
      case "Sequance5AirPressureCycles2":
        setSequance5AirPressureCycles2(newValue);
        break;
      case "Sequance6AirPressureCycles1":
        setSequance6AirPressureCycles1(newValue);
        break;
      case "Sequance6AirPressureCycles2":
        setSequance6AirPressureCycles2(newValue);
        break;
      case "Sequance7AirPressureCycles1":
        setSequance7AirPressureCycles1(newValue);
        break;
      case "Sequance7AirPressureCycles2":
        setSequance7AirPressureCycles2(newValue);
        break;
      case "Sequance8AirPressureCycles1":
        setSequance8AirPressureCycles1(newValue);
        break;
      case "Sequance8AirPressureCycles2":
        setSequance8AirPressureCycles2(newValue);
        break;

      case "Sequance1NumOfCycle":
        setSequance1NumOfCycle(newValue);
        break;
      case "Sequance2NumOfCycle":
        setSequance2NumOfCycle(newValue);
        break;
      case "Sequance3NumOfCycle":
        setSequance3NumOfCycle(newValue);
        break;
      case "Sequance4NumOfCycle":
        setSequance4NumOfCycle(newValue);
        break;
      case "Sequance5NumOfCycle":
        setSequance5NumOfCycle(newValue);
        break;
      case "Sequance6NumOfCycle":
        setSequance6NumOfCycle(newValue);
        break;
      case "Sequance7NumOfCycle":
        setSequance7NumOfCycle(newValue);
        break;
      case "Sequance8NumOfCycle":
        setSequance8NumOfCycle(newValue);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.neededDevice.deviceID,
        current_index_1_positive: Sequance1AirPressureCycles1,
        current_index_1_Negative: Sequance1AirPressureCycles2,
        current_index_1_cycles: Sequance1NumOfCycle,

        current_index_2_positive: Sequance2AirPressureCycles1,
        current_index_2_Negative: Sequance2AirPressureCycles2,
        current_index_2_cycles: Sequance2NumOfCycle,

        current_index_3_positive: Sequance3AirPressureCycles1,
        current_index_3_Negative: Sequance3AirPressureCycles2,
        current_index_3_cycles: Sequance3NumOfCycle,

        current_index_4_positive: Sequance4AirPressureCycles1,
        current_index_4_Negative: Sequance4AirPressureCycles2,
        current_index_4_cycles: Sequance4NumOfCycle,

        current_index_5_positive: Sequance5AirPressureCycles1,
        current_index_5_Negative: Sequance5AirPressureCycles2,
        current_index_5_cycles: Sequance5NumOfCycle,

        current_index_6_positive: Sequance6AirPressureCycles1,
        current_index_6_Negative: Sequance6AirPressureCycles2,
        current_index_6_cycles: Sequance6NumOfCycle,

        current_index_7_positive: Sequance7AirPressureCycles1,
        current_index_7_Negative: Sequance7AirPressureCycles2,
        current_index_7_cycles: Sequance7NumOfCycle,

        current_index_8_positive: Sequance8AirPressureCycles1,
        current_index_8_Negative: Sequance8AirPressureCycles2,
        current_index_8_cycles: Sequance8NumOfCycle,

        current_index_1_finished: Sequance1Finished,
        current_index_2_finished: Sequance2Finished,
        current_index_3_finished: Sequance3Finished,
        current_index_4_finished: Sequance4Finished,
        current_index_5_finished: Sequance5Finished,
        current_index_6_finished: Sequance6Finished,
        current_index_7_finished: Sequance7Finished,
        current_index_8_finished: Sequance8Finished,
      })
    );
  }, [
    Sequance1AirPressureCycles1,
    Sequance1AirPressureCycles2,
    Sequance1NumOfCycle,
    Sequance2AirPressureCycles1,
    Sequance2AirPressureCycles2,
    Sequance2NumOfCycle,
    Sequance3AirPressureCycles1,
    Sequance3AirPressureCycles2,
    Sequance3NumOfCycle,
    Sequance4AirPressureCycles1,
    Sequance4AirPressureCycles2,
    Sequance4NumOfCycle,
    Sequance5AirPressureCycles1,
    Sequance5AirPressureCycles2,
    Sequance5NumOfCycle,
    Sequance6AirPressureCycles1,
    Sequance6AirPressureCycles2,
    Sequance6NumOfCycle,
    Sequance7AirPressureCycles1,
    Sequance7AirPressureCycles2,
    Sequance7NumOfCycle,
    Sequance8AirPressureCycles1,
    Sequance8AirPressureCycles2,
    Sequance8NumOfCycle,
    props.designLoadPositive,
    props.designLoadNegative,
    Sequance1Finished,
    Sequance2Finished,
    Sequance3Finished,
    Sequance4Finished,
    Sequance5Finished,
    Sequance6Finished,
    Sequance7Finished,
    Sequance8Finished,
  ]);

  return (
    <>
      <div className="row">
        <div className="col-6 col-md-5 col-lg-4 mt-3">
          <h4>{props.type} Pressure Differential Loading</h4>
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
                }}
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "87px" }}>
                      <h6>Loading Sequence</h6>
                    </th>
                    <th style={{ width: "82px" }}>
                      <h6>Loading Direction</h6>
                    </th>
                    <th style={{ width: "250px" }}>
                      <h6>Air Pressure Cycles</h6>
                    </th>
                    <th style={{ width: "79px" }}>
                      <h6>Number of Air Pressure Cycles</h6>
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
                  {/* Row 1 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={1}
                    loadingDirection="inward"
                    airPressureCycles1={Sequance1AirPressureCycles1}
                    airPressureCycles2={Sequance1AirPressureCycles2}
                    numOfCycles={Sequance1NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance1Finished}
                  />

                  {/* Row 2 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={2}
                    loadingDirection="inward"
                    airPressureCycles1={Sequance2AirPressureCycles1}
                    airPressureCycles2={Sequance2AirPressureCycles2}
                    numOfCycles={Sequance2NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance2Finished}
                  />

                  {/* Row 3 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={3}
                    loadingDirection="inward"
                    airPressureCycles1={Sequance3AirPressureCycles1}
                    airPressureCycles2={Sequance3AirPressureCycles2}
                    numOfCycles={Sequance3NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance3Finished}
                  />

                  {/* Row 4 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={4}
                    loadingDirection="inward"
                    airPressureCycles1={Sequance4AirPressureCycles1}
                    airPressureCycles2={Sequance4AirPressureCycles2}
                    numOfCycles={Sequance4NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance4Finished}
                  />

                  {/* Row 5 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={5}
                    loadingDirection="outward"
                    airPressureCycles1={Sequance5AirPressureCycles1}
                    airPressureCycles2={Sequance5AirPressureCycles2}
                    numOfCycles={Sequance5NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance5Finished}
                  />

                  {/* Row 6 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={6}
                    loadingDirection="outward"
                    airPressureCycles1={Sequance6AirPressureCycles1}
                    airPressureCycles2={Sequance6AirPressureCycles2}
                    numOfCycles={Sequance6NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance6Finished}
                  />

                  {/* Row 7 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={7}
                    loadingDirection="outward"
                    airPressureCycles1={Sequance7AirPressureCycles1}
                    airPressureCycles2={Sequance7AirPressureCycles2}
                    numOfCycles={Sequance7NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance7Finished}
                  />

                  {/* Row 8 */}
                  <CyclicPressureTableRowCustom
                    sequenceNumber={8}
                    loadingDirection="outward"
                    airPressureCycles1={Sequance8AirPressureCycles1}
                    airPressureCycles2={Sequance8AirPressureCycles2}
                    numOfCycles={Sequance8NumOfCycle}
                    onInputChange={handleInputChange}
                    isEditable={props.isEditable}
                    finished={Sequance8Finished}
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

export default CyclicPressureTableCustom;
