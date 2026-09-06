import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";
import HookMqtt from "../Mqtt1";
import StaticAdjust from "./static_adjust";
import DynamicAdjust from "./dynamic_adjust";
import { devicesActions } from "../../store/sensors-slice";
import Controls from "./Controls";
import { generalActions } from "../../store/general-slice";
import ConfirmationModal from "../Modals/ConfirmationModal";
import axios from "axios";
import AddRowStaticPressureLoadingModal from "../Modals/AddRowStaticPressureLoadingModal";
import AddRowCyclicPressureLoadingModal from "../Modals/AddRowCyclicPressureLoadingModal";

const Adjust = (props) => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const deviceID = props.deviceID;
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);
  let status = neededDevice.status;
  let current_speed = neededDevice.current_speed;
  let resume_data = neededDevice.resume_data;
  const selectedCommonSensorIDs = useSelector(
    (state) => state.general.selectedCommonSensorIDs
  );

  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonName, setButtonName] = useState("Start");
  const [buttonClass, setButtonClass] = useState("btn btn-success btn-lg");
  const [setPoint, setSetPoint] = useState(0); // Assuming setPoint is a state
  const [holdTime, setHoldTime] = useState(0); // Assuming holdTime is a state
  const [isSliderChanged, setIsSliderChanged] = useState(false);
  const [testID, setTestID] = useState(0);
  const [testIndex, setTestIndex] = useState(0);
  const [FinishModalVisible, setFinishModalVisible] = useState(false);

  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'static' or 'cyclic'
  const [newRowData, setNewRowData] = useState({
    pressure_factor: "Structural Pressure",
    pressure: 0,
    index: 0,
    duration: 0,
    type: "inward",
    id: 0,
    deflections: [],
    finished: false,
    high_pressure: 0,
    low_pressure: 0,
    cycles: 0,
  });

  const handleAddCustomRow = () => {
    setModalType(toggleState === "static_load" ? "static" : "cyclic");
    setShowAddRowModal(true);
  };

  const handleSaveNewRow = () => {
    console.log("Saving new row:", newRowData);

    // Calculate the next available index
    const maxIndex =
      Math.max(
        ...neededDevice.presetStaticRows.map((row) => row.index),
        ...neededDevice.customStaticRows.map((row) => row.index),
        ...neededDevice.presetCyclicRows.map((row) => row.index),
        ...neededDevice.customCyclicRows.map((row) => row.index),
        -1
      ) + 1;

    // Prepare the row data for the API
    const rowToSend = {
      index: maxIndex,
      pressure: Number(newRowData.pressure),
      duration: Number(newRowData.duration),
      type: newRowData.type,
      preset: false,
      high_pressure: Number(newRowData.high_pressure),
      low_pressure: Number(newRowData.low_pressure),
      cycles: Number(newRowData.cycles),
    };

    // Determine the API endpoint based on modalType
    const endpoint =
      modalType === "static"
        ? `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests/`
        : `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic-tests/`;

    // Send the row to the backend
    axios
      .post(endpoint, rowToSend, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const createdRow = {
          ...newRowData,
          ...response.data,
          // index: maxIndex, 
          pressure: Number(newRowData.pressure),
          duration: Number(newRowData.duration),
          high_pressure: Number(newRowData.high_pressure),
          low_pressure: Number(newRowData.low_pressure),
          cycles: Number(newRowData.cycles),
          finished: false,
          preset: false,
        };

        // Dispatch to Redux store
        if (modalType === "static") {
          dispatch(
            devicesActions.addCustomStaticRow({
              deviceID: deviceID,
              row: createdRow,
            })
          );
        } else if (modalType === "cyclic") {
          dispatch(
            devicesActions.addCustomCyclicRow({
              deviceID: deviceID,
              row: createdRow,
            })
          );
        }

        // Close modal and reset data
        setShowAddRowModal(false);
        setNewRowData({
          pressure_factor: "Structural Pressure",
          pressure: 0,
          index: 0,
          duration: 0,
          type: "inward",
          id: 0,
          deflections: [],
          finished: false,
          high_pressure: 0,
          low_pressure: 0,
          cycles: 0,
        });
      })
      .catch((error) => {
        console.error(
          `Failed to create custom ${modalType} test row:`,
          error.response?.data || error.message
        );
        alert(
          `Error saving custom ${modalType} row. Please try again or contact support.`
        );
      });
  };
  const isValid =
    modalType === "static"
      ? newRowData.pressure !== "" &&
        !isNaN(newRowData.pressure) &&
        newRowData.duration !== "" &&
        !isNaN(newRowData.duration)
      : newRowData.high_pressure !== "" &&
        !isNaN(newRowData.high_pressure) &&
        newRowData.low_pressure !== "" &&
        !isNaN(newRowData.low_pressure) &&
        newRowData.cycles !== "" &&
        !isNaN(newRowData.cycles);

  let toggleState = neededDevice.toggle;
  const prevStatusRef = useRef(null); // Initialize to null to detect initial load
  const isInitialLoadRef = useRef(true); // Track if this is the initial load

  useEffect(() => {
    console.log("adjust.js status:", status, "prevStatus:", prevStatusRef.current);
    
    // Define non-test states (these should not trigger the finish modal)
    const nonTestStates = ["idle", "connecting ...", "initial"];
    
    // Map non-test states to "idle" for comparison
    const effectiveStatus = nonTestStates.includes(status) ? "idle" : status;
    const prevEffectiveStatus =
      prevStatusRef.current === null || prevStatusRef.current === undefined
        ? null
        : nonTestStates.includes(prevStatusRef.current)
        ? "idle"
        : prevStatusRef.current;

    // On initial load, just store the status and return early
    if (prevStatusRef.current === null) {
      console.log("Initial load - storing status, not showing modal");
      prevStatusRef.current = status;
      isInitialLoadRef.current = false;
      return;
    }

    // Check if the effective status has changed from "idle" to anything else
    // or from anything else to "idle"
    if (
      (prevEffectiveStatus === "idle" && effectiveStatus !== "idle") ||
      (prevEffectiveStatus !== "idle" && effectiveStatus === "idle")
    ) {
      dispatch(
        devicesActions.readInit({
          deviceID: props.deviceID,
          value: false,
        })
      );
    }

    // Only show the finish modal if:
    // 1. Previous status was a test-running state (not "idle", "initial", "connecting ...", or null)
    // 2. Current status is "idle"
    // This prevents showing the modal on backend restart (idle -> idle) or initial load (initial -> idle)
    const isTestRunningState = prevEffectiveStatus !== null && 
                               prevEffectiveStatus !== "idle" &&
                               !nonTestStates.includes(prevStatusRef.current);
    
    if (isTestRunningState && effectiveStatus === "idle") {
      // Show the modal asking if the test is finished
      console.log("Test completed - showing finish modal. Previous status was:", prevStatusRef.current);
      setFinishModalVisible(true);
    } else {
      console.log("Not showing modal - prevStatus:", prevStatusRef.current, "currentStatus:", status, "isTestRunningState:", isTestRunningState);
    }

    // Update the previous status to the current one
    prevStatusRef.current = status; // Store the actual status, not the effective one
  }, [status]);

  useEffect(() => {
    // console.log(status);
    if (status.includes("resume")) {
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID: props.deviceID,
          toggle: "dynamic_load",
        })
      );
    } else {
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID: props.deviceID,
          toggle: "static_load",
        })
      );
    }
  }, []);

  const handleSensorChange = (e) => {
    setSelectedSensor(parseInt(e.target.value, 10)); // Parse value to integer
  };

  const handleSetPointChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input value is a valid positive number (integer or floating point)
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setSetPoint(inputValue === "" ? "" : parseFloat(inputValue));
    }
  };

  const handleHoldTimeChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input value is empty or a valid positive integer
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setHoldTime(inputValue === "" ? "" : parseInt(inputValue, 10));
    }
  };

  const handlePlus = (value) => {
    if (
      status === "tuning" ||
      status.includes("Holding") ||
      status.includes("Cycle")
    ) {
      setIsSliderChanged(true); // Track that the user changed the slider manually
      setSliderValue((prevValue) => {
        const newValue = parseFloat(prevValue) + parseFloat(value);
        // Check if newValue exceeds the maximum value
        return newValue > 60 ? 60 : newValue;
      });
    }
  };

  const handleMinus = (value) => {
    if (
      status === "tuning" ||
      status.includes("Holding") ||
      status.includes("Cycle")
    ) {
      setIsSliderChanged(true); // Track that the user changed the slider manually
      setSliderValue((prevValue) => {
        const newValue = parseFloat(prevValue) - parseFloat(value);
        // Check if newValue goes below the minimum value
        return newValue < 0 ? 0 : newValue;
      });
    }
  };

  const waitingRef = useRef(false);
  const startAfterSensorSelection = useSelector(
    (state) => state.general.startAfterSensorSelection
  );

  useEffect(() => {
    if (startAfterSensorSelection && waitingRef.current) {
      waitingRef.current = false;
      dispatch(generalActions.setStartAfterSensorSelection({ value: false }));
      handleStartBtn(false); // Automatically trigger start after sensor selection
    }
  }, [startAfterSensorSelection]);

  const handleStartBtn = (cont) => {
    // Reset in case previous modal was closed without selection
    if (!startAfterSensorSelection && waitingRef.current) {
      waitingRef.current = false;
    }

    if (
      (buttonName === "Start" || buttonName === "Resume") &&
      !waitingRef.current &&
      cont
    ) {
      // Enable CommonSensorsTable and unhide Done button
      dispatch(generalActions.setCommonSensorsTableDisable({ value: false }));
      dispatch(generalActions.setStartAfterSensorSelection({ value: false }));
      dispatch(generalActions.setDevicesDisabled({ value: false }));
      waitingRef.current = true;
      return;
    }

    // Function to handle button click
    if (buttonName === "Start" || buttonName === "Resume") {
      // kan start only
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID: props.deviceID,
          static_values_sensor: selectedSensor,
          static_values_SetPoint: setPoint,
          static_values_HoldTime: holdTime,
          cyclic_values_high_pressure: PositiveSetPoint,
          cyclic_values_low_pressure: NegativeSetPoint,
          cyclic_values_number_of_cycles: NumberOfCycles,
        })
      );

      console.log("omda user_index to be sent is", neededDevice.user_index);
      let user_index = localStorage.getItem(`user_index_${props.deviceID}`);
      console.log("omda user_index to be sent is", user_index);
      let dataa = {
        current_values: {
          project_values: {
            project_name: neededDevice.project_name,
            design_load: {
              positive: neededDevice.design_load_positive,
              negative: neededDevice.design_load_negative,
            },
          },
          static_values: {
            setpoint: setPoint,
            sensor: selectedSensor,
            hold_time: holdTime,
          },
          cyclic_values: {
            high_Pressure: PositiveSetPoint,
            low_Pressure: NegativeSetPoint,
            number_of_cycles: NumberOfCycles,
            current_index: user_index,
            1: {
              positive: neededDevice.current_index_1_positive,
              negative: neededDevice.current_index_1_Negative,
              cycles: neededDevice.current_index_1_cycles,
            },
            2: {
              positive: neededDevice.current_index_2_positive,
              negative: neededDevice.current_index_2_Negative,
              cycles: neededDevice.current_index_2_cycles,
            },
            3: {
              positive: neededDevice.current_index_3_positive,
              negative: neededDevice.current_index_3_Negative,
              cycles: neededDevice.current_index_3_cycles,
            },
            4: {
              positive: neededDevice.current_index_4_positive,
              negative: neededDevice.current_index_4_Negative,
              cycles: neededDevice.current_index_4_cycles,
            },
            5: {
              positive: neededDevice.current_index_5_positive,
              negative: neededDevice.current_index_5_Negative,
              cycles: neededDevice.current_index_5_cycles,
            },
            6: {
              positive: neededDevice.current_index_6_positive,
              negative: neededDevice.current_index_6_Negative,
              cycles: neededDevice.current_index_6_cycles,
            },
            7: {
              positive: neededDevice.current_index_7_positive,
              negative: neededDevice.current_index_7_Negative,
              cycles: neededDevice.current_index_7_cycles,
            },
            8: {
              positive: neededDevice.current_index_8_positive,
              negative: neededDevice.current_index_8_Negative,
              cycles: neededDevice.current_index_8_cycles,
            },
          },
          others: {
            Temperature: neededDevice.Temperature,
            Humidity: neededDevice.Humidity,
            toggle: neededDevice.toggle,
          },
        },
      };

      console.log("dataaaaa", dataa);
      ref3.current.mqttPub({
        topic: `device${deviceID}/current_input`,
        qos: 1,
        payload: JSON.stringify(dataa),
      });

      setButtonName("Emergency Stop");
      setButtonClass("btn btn-danger btn-lg");
      console.log("start pressed");

      if (toggleState == "static_load") {
        if (
          !isNaN(setPoint) &&
          !isNaN(holdTime) &&
          !isNaN(selectedSensor) &&
          selectedSensor != "0"
        ) {
          var message = {};
          message = {
            command: "start",
            mode: "manual",
            custom_preset: "preset",
            sensor_id: selectedSensor.toString(),
            test_id: testID,
            project_id: props.projectID,
            selectedSensors: selectedCommonSensorIDs,
            test_index: testIndex,
          };

          ref3.current.mqttPub({
            topic: `device${deviceID}/command`,
            qos: 1,
            payload: JSON.stringify(message),
          });
        }
      } else if (toggleState == "dynamic_load") {
        if (
          !isNaN(PositiveSetPoint) &&
          !isNaN(NegativeSetPoint) &&
          !isNaN(NumberOfCycles) &&
          !isNaN(selectedSensor) &&
          selectedSensor != "0"
        ) {
          // const test_index_now = localStorage.getItem(`test_index_wanted_device(${deviceID})`)
          const test_index_now = neededDevice.current_index;

          var message = {};
          message = {
            command: "start",
            mode: "cyclic",
            custom_preset: "preset",
            sensor_id: selectedSensor.toString(),
            test_id: testID,
            project_id: props.projectID,
            selectedSensors: selectedCommonSensorIDs,
            test_index: testIndex,
          };

          ref3.current.mqttPub({
            topic: `device${deviceID}/command`,
            qos: 1,
            payload: JSON.stringify(message),
          });
        }
      }
    } else if (buttonName === "Emergency Stop") {
      var message = "";
      ref3.current.mqttPub({
        topic: `device${deviceID}/emergency_stop`,
        qos: 1,
        payload: JSON.stringify(message),
      });
    }
  };

  const handleSensorSelectionDone = () => {
    dispatch(generalActions.setCommonSensorsTableDisable({ value: true }));
    setTimeout(() => {
      handleStartBtn(); // re-trigger to continue
    }, 0);
  };

  useEffect(() => {
    // console.log("status", status);
    // Whenever the status changes, check if it's "idle" and a sensor is selected,
    // if so, enable the start button
    if (status === "idle") {
      setButtonName("Start");
      setButtonClass("btn btn-success btn-lg");
    } else if (status.includes("resume")) {
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID: props.deviceID,
          toggle: "dynamic_load",
        })
      );
      dispatch(
        devicesActions.readToggle({
          deviceID: props.deviceID,
          value: "dynamic_load",
        })
      );
      setButtonName("Resume");
      setButtonClass("btn btn-warning btn-lg");
      if (resume_data.command !== undefined) {
        if (resume_data.command.mode == "cyclic") {
          setPositiveSetPoint(resume_data.command.positive);
          setNegativeSetPoint(resume_data.command.negative);
          setSelectedSensor(resume_data.command.sensor_id);
          setNumberOfCycles(resume_data.command.cycles);
          console.log("test index recived = ", resume_data.command.test_index);
          dispatch(
            devicesActions.readCurrentTestIndex({
              deviceID: deviceID,
              value: resume_data.command.test_index,
            })
          );
        }
      }
      // } else if (status.includes("Cycle")) {
    } else {
      setButtonName("Emergency Stop");
      setButtonClass("btn btn-danger btn-lg");
    }
  }, [status, resume_data]);

  // test refresh
  useEffect(() => {
    // Check if a refresh has occurred by checking local storage
    const refreshFlag = localStorage.getItem(`refreshFlag${props.deviceID}`);
    if (refreshFlag) {
      // Reset the refresh flag
      localStorage.removeItem(`refreshFlag${props.deviceID}`);
      // Execute your command after refresh here
      if (
        status !== "idle" &&
        status !== "connecting ..." &&
        !status.includes("resume")
      ) {
        setButtonName("Emergency Stop");
        setButtonClass("btn btn-danger btn-lg");
      }
    }
  }, [status]); // Depend on the status state variable

  useEffect(() => {
    // Set the refresh flag in local storage when the component mounts
    localStorage.setItem(`refreshFlag${props.deviceID}`, "true");
  }, []);
  // test refresh

  useEffect(() => {
    // console.log("trace => nothing did")
    if (
      status !== "tuning" &&
      !status.includes("Holding") &&
      !status.includes("Cycle")
    ) {
      setSliderValue(current_speed);
    }
  }, [status, current_speed]);

  const isSliderEnabled =
    buttonName === "Emergency Stop" &&
    (status === "tuning" ||
      status.includes("Holding") ||
      status.includes("Cycle"));

  useEffect(() => {
    if (isSliderEnabled && isSliderChanged) {
      console.log("sliderValue", sliderValue);
      var message = {
        command: "set_frequency",
        parameter: sliderValue,
      };
      ref3.current.mqttPub({
        topic: `device${deviceID}/vfd/command`,
        qos: 1,
        payload: JSON.stringify(message),
      });
      setIsSliderChanged(false); // Reset after sending
    }
  }, [status, sliderValue, isSliderEnabled, isSliderChanged]);

  // sensors object to list
  const sensorsList = Object.entries(neededDevice.sensors).map(
    ([key, value]) => ({
      ...value,
      id: key, // Add an 'id' field to preserve the original key
    })
  );

  const createSelector = () => {
    let options = [];
    options.push(
      <option key="-1" value="-1">
        Select a sensor
      </option>
    ); // Unique key for default option
    sensorsList.forEach((sensor) => {
      if (sensor.role === "pressure") {
        options.push(
          <option key={sensor.address} value={sensor.address}>
            {sensor.name}
          </option>
        );
      }
    });
    return options;
  };

  //for dynamic_load
  const [PositiveSetPoint, setPositiveSetPoint] = useState(0); // Assuming setPoint is a state
  const [NegativeSetPoint, setNegativeSetPoint] = useState(0); // Assuming setPoint is a state
  const [NumberOfCycles, setNumberOfCycles] = useState(0); // Assuming setPoint is a state

  const handlePositiveSetPointChange = (e) => {
    const inputValue = e.target.value;
    // console.log("trace => Positive SetPoint Input Value:", inputValue); // Log user input
    // Check if the input value is a valid number (integer or floating point, including positive numbers)
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      setPositiveSetPoint(inputValue === "" ? "" : parseFloat(inputValue));
      // console.log("trace => Updated Positive SetPoint State:", inputValue); // Log updated state
    }
  };

  const handleNegativeSetPointChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input value is a valid integer (including negative numbers)
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      setNegativeSetPoint(inputValue === "" ? "" : parseFloat(inputValue));
    }
  };

  const handleNumberOfCyclesChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input value is empty or a valid positive integer
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setNumberOfCycles(inputValue === "" ? "" : parseInt(inputValue, 10));
    }
  };

  useEffect(() => {
    // console.log("trace => in adjust neededDevice = ", neededDevice);
    setSetPoint(neededDevice.static_values_SetPoint);
    setHoldTime(neededDevice.static_values_HoldTime);
    setPositiveSetPoint(neededDevice.cyclic_values_high_pressure);
    setNegativeSetPoint(neededDevice.cyclic_values_low_pressure);
    setNumberOfCycles(neededDevice.cyclic_values_number_of_cycles);
    setSelectedSensor(neededDevice.static_values_sensor);
  }, [
    neededDevice.static_values_SetPoint,
    neededDevice.static_values_HoldTime,
    neededDevice.cyclic_values_high_pressure,
    neededDevice.cyclic_values_low_pressure,
    neededDevice.cyclic_values_number_of_cycles,
    neededDevice.static_values_sensor,
    // neededDevice.customStaticRows,
    // neededDevice.customCyclicRows,
    // neededDevice.presetStaticRows,
    // neededDevice.presetCyclicRows,
  ]);

  const custom_preset_toggle = neededDevice.custom_preset_toggle;

  const testConfirmation = () => {
    let toggleNow;
    if (toggleState === "static_load") {
      toggleNow = "static_tests";
    } else {
      toggleNow = "cyclic_tests";
    }
    console.log(testIndex);
    axios
      .put(
        `http://${window.location.hostname}:8000/projects/${props.projectID}/${toggleNow}/${testIndex}/finish`
      )
      .then((res) => {
        console.log("=== TEST FINISHED API RESPONSE ===");
        console.log("Status:", res.status);
        console.log("Response data:", res.data);
        console.log("Test index:", testIndex);
        console.log("Test type:", toggleNow);
        console.log("Project ID:", props.projectID);
        
        // Update the Redux store directly with the finished test status
        // This ensures the GUI updates immediately without waiting for server refresh
        if (toggleNow === "cyclic_tests") {
          // Update preset cyclic rows
          dispatch(
            devicesActions.setPresetCyclicRows({
              deviceID: neededDevice.deviceID,
              rows: neededDevice.presetCyclicRows.map((test, index) => 
                index === testIndex ? { ...test, finished: true } : test
              ),
            })
          );
          // Update custom cyclic rows - find by test index/id
          dispatch(
            devicesActions.setCustomCyclicRows({
              deviceID: neededDevice.deviceID,
              rows: neededDevice.customCyclicRows.map((test) => 
                test.index === testIndex ? { ...test, finished: true } : test
              ),
            })
          );
        } else if (toggleNow === "static_tests") {
          // Update preset static rows
          dispatch(
            devicesActions.setPresetStaticRows({
              deviceID: neededDevice.deviceID,
              rows: neededDevice.presetStaticRows.map((test, index) => 
                index === testIndex ? { ...test, finished: true } : test
              ),
            })
          );
          // Update custom static rows - find by test index/id
          dispatch(
            devicesActions.setCustomStaticRows({
              deviceID: neededDevice.deviceID,
              rows: neededDevice.customStaticRows.map((test) => 
                test.index === testIndex ? { ...test, finished: true } : test
              ),
            })
          );
        }
        
        console.log("Test marked as finished, Redux store updated directly");
      })
      .catch((err) => {
        console.error(
          "Error marking test as finished:",
          err.response?.data || err.message
        );
      });
  };

  return (
    <>
      {showAddRowModal && modalType === "static" && (
        <AddRowStaticPressureLoadingModal
          newRowData={newRowData}
          setNewRowData={setNewRowData}
          isValid={isValid}
          onCancel={() => setShowAddRowModal(false)}
          onSave={handleSaveNewRow}
        />
      )}

      {showAddRowModal && modalType === "cyclic" && (
        <AddRowCyclicPressureLoadingModal
          newRowData={newRowData}
          setNewRowData={setNewRowData}
          isValid={isValid}
          onCancel={() => setShowAddRowModal(false)}
          onSave={handleSaveNewRow}
        />
      )}
      {/* {console.log("*********custom / preset**", custom_preset_toggle)}
      {console.log("*********static / cyclic**", toggleState)} */}

      <ConfirmationModal
        visible={FinishModalVisible}
        title="Test Status"
        message="Is the test finished?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {
          // Handle confirmation (e.g., mark the test as finished)
          setFinishModalVisible(false); // Close the modal
          testConfirmation();
          // You can add any additional logic for confirming the test finish here.
        }}
        onCancel={() => {
          // Handle cancellation (e.g., keep the test running)
          setFinishModalVisible(false); // Close the modal
        }}
      />
      <HookMqtt ref={ref3} topics={[]} />
      <div className="col-8">
        <div className="card text-white bg-dark">
          <div className="card-body">
            <label className="form-label">
              <b>Frequency:</b>
              <i id="sliderValue">{sliderValue}</i>
            </label>
            <div className="input-group  d-flex">
              <button
                className="btn btn-light"
                disabled={
                  buttonName !== "Emergency Stop" ||
                  (status !== "tuning" &&
                    !status.includes("Holding") &&
                    !status.includes("Cycle"))
                }
                type="button"
                onClick={() => handleMinus(3)}
                id="minusMinusButton"
              >
                --
              </button>
              <button
                className="btn btn-light"
                disabled={
                  buttonName !== "Emergency Stop" ||
                  (status !== "tuning" &&
                    !status.includes("Holding") &&
                    !status.includes("Cycle"))
                }
                type="button"
                onClick={() => handleMinus(0.5)}
                id="minusButton"
              >
                -
              </button>
              <div className="border-top border-bottom border-white flex-grow-1 pt-2">
                <input
                  disabled={
                    // buttonName !== "Emergency Stop" || (status !== "tuning" && !status.includes("Holding"))
                    buttonName !== "Emergency Stop" ||
                    (status !== "tuning" &&
                      !status.includes("Holding") &&
                      !status.includes("Cycle"))
                  }
                  type="range"
                  className="form-range"
                  min="0"
                  max="60"
                  step="0.01"
                  value={sliderValue}
                  // onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                  onChange={(e) => {
                    setSliderValue(parseFloat(e.target.value));
                    setIsSliderChanged(true); // Track that the user changed the slider manually
                  }}
                  id="rangeSlider"
                />
              </div>
              <button
                className="btn btn-light"
                disabled={
                  buttonName !== "Emergency Stop" ||
                  (status !== "tuning" &&
                    !status.includes("Holding") &&
                    !status.includes("Cycle"))
                }
                type="button"
                onClick={() => handlePlus(0.5)}
                id="plusButton"
              >
                +
              </button>
              <button
                className="btn btn-light"
                disabled={
                  buttonName !== "Emergency Stop" ||
                  (status !== "tuning" &&
                    !status.includes("Holding") &&
                    !status.includes("Cycle"))
                }
                type="button"
                onClick={() => handlePlus(3)}
                id="plusPlusButton"
              >
                ++
              </button>
            </div>
            <br />
            <div className="row">
              <p>
                <span
                  className="led led-on"
                  id="currentSpeed_led"
                  style={{
                    verticalAlign: "text-bottom",
                  }}
                ></span>
                <b>Current Speed:</b>
                <i id="currentSpeed">{current_speed}</i>
              </p>
            </div>
            <hr />

            {toggleState == "static_load" ? (
              <StaticAdjust
                selectedSensor={selectedSensor}
                handleSensorChange={handleSensorChange}
                buttonName={buttonName}
                setPoint={setPoint}
                handleSetPointChange={handleSetPointChange}
                holdTime={holdTime}
                handleHoldTimeChange={handleHoldTimeChange}
                createSelector={createSelector}
                custom_preset_toggle={custom_preset_toggle}
                selectedTest={selectedTest}
              />
            ) : toggleState == "dynamic_load" ? (
              <DynamicAdjust
                selectedSensor={selectedSensor}
                handleSensorChange={handleSensorChange}
                buttonName={buttonName}
                PositiveSetPoint={PositiveSetPoint}
                NegativeSetPoint={NegativeSetPoint}
                NumberOfCycles={NumberOfCycles}
                handlePositiveSetPointChange={handlePositiveSetPointChange}
                handleNegativeSetPointChange={handleNegativeSetPointChange}
                handleNumberOfCyclesChange={handleNumberOfCyclesChange}
                createSelector={createSelector}
                custom_preset_toggle={custom_preset_toggle}
                selectedTest={selectedTest}
              />
            ) : null}

            {/* <CommonSensorsTable onDone={handleSensorSelectionDone} /> */}

            <Controls
              deviceID={deviceID}
              buttonClass={buttonClass}
              handleStartBtn={handleStartBtn}
              buttonName={buttonName}
              status={status}
              selectedSensor={selectedSensor}
              ref3={ref3}
              setSetPoint={setSetPoint}
              setHoldTime={setHoldTime}
              setPositiveSetPoint={setPositiveSetPoint}
              setNegativeSetPoint={setNegativeSetPoint}
              setNumberOfCycles={setNumberOfCycles}
              setTestID={setTestID}
              setTestIndex={setTestIndex}
              setButtonName={setButtonName}
              setButtonClass={setButtonClass}
              project_id={props.projectID}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
              onAddCustomRow={handleAddCustomRow} // Add this prop
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Adjust;
