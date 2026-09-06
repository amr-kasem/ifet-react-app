// import ControlsButton from "./ControlsButton";
// import "./Controls.css";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { devicesActions } from "../../store/sensors-slice";
// import ToggleButtonGeneral from "../ToggleButtonGeneral/ToggleButtonGeneral";

// const Controls = ({
//   deviceID,
//   buttonClass,
//   handleStartBtn,
//   buttonName,
//   status,
//   selectedSensor,
//   ref3,
//   setSetPoint,
//   setHoldTime,
//   setPositiveSetPoint,
//   setNegativeSetPoint,
//   setNumberOfCycles,
//   setTestID,
//   setButtonName,
//   setButtonClass,
//   project_id,
//   setTestIndex,
//   selectedTest,
//   setSelectedTest,
// }) => {
//   const dispatch = useDispatch();
//   const devices = useSelector((state) => state.devices["devices"]);
//   const neededDevice = devices.find((device) => device.deviceID === deviceID);

//   const toggle = neededDevice.toggle;
//   const custom_preset_toggle = neededDevice.custom_preset_toggle;
//   const presetCyclicRows = neededDevice.presetCyclicRows || [];
//   const customCyclicRows = neededDevice.customCyclicRows || [];
//   const presetStaticRows = neededDevice.presetStaticRows || [];
//   const customStaticRows = neededDevice.customStaticRows || [];

//   // const [selectedTest, setSelectedTest] = useState(null);
//   const [selectedTestCyclicIndex, setSelectedTestCyclicIndex] = useState(null);

//   // Get the next unfinished preset cyclic test
//   const getNextUnfinishedCyclicTest = () => {
//     if (toggle === "dynamic_load" && custom_preset_toggle === "Preset") {
//       const sortedTests = [...presetCyclicRows].sort((a, b) => a.index - b.index);
//       return sortedTests.find(test => !test.finished) || null;
//     }
//     return null;
//   };

//   // Check if all preset tests are finished
//   const areAllPresetTestsFinished = () => {
//     if (toggle === "dynamic_load") {
//       return presetCyclicRows.every(test => test.finished) || presetCyclicRows.length === 0;
//     }
//     return true; // For static loads, we don't enforce this sequence
//   };

//   // Get available unfinished preset static tests
//   const getAvailablePresetStaticTests = () => {
//     return presetStaticRows.filter(test => test.finished !== true);
//   };

//   // Get available unfinished custom static tests
//   const getAvailableCustomStaticTests = () => {
//     return customStaticRows.filter(test => test.finished !== true);
//   };

//   const handleToggleChange = (newValue) => {
//     dispatch(
//       devicesActions.readCustomPresetToggle({
//         deviceID,
//         value: newValue,
//       })
//     );
//     setSelectedTest(null);

//     let testsAvailable = false;

//     if (newValue === "Preset") {
//       if (toggle === "dynamic_load") {
//         testsAvailable =
//           presetCyclicRows.filter((test) => !test.finished).length > 0;
//       } else if (toggle === "static_load") {
//         testsAvailable = getAvailablePresetStaticTests().length > 0;
//       }
//     } else if (newValue === "Custom") {
//       if (toggle === "dynamic_load") {
//         testsAvailable = customCyclicRows.length > 0 && areAllPresetTestsFinished();
//       } else if (toggle === "static_load") {
//         testsAvailable = getAvailableCustomStaticTests().length > 0;
//       }
//     }

//     if (!testsAvailable) {
//       setSetPoint(0);
//       setHoldTime(0);
//       setPositiveSetPoint(0);
//       setNegativeSetPoint(0);
//       setNumberOfCycles(0);
//       setTestID(null);
//       setButtonName("Start");
//       setButtonClass("btn btn-success btn-lg");
//     }

//     if (newValue === "Custom") {
//       dispatch(
//         devicesActions.setAllPageStatus({
//           deviceID,
//           wardToggle: "inward",
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     handleTestSelection(selectedTest, true);
//   }, [
//     neededDevice.customStaticRows,
//     neededDevice.customCyclicRows,
//     neededDevice.presetStaticRows,
//     neededDevice.presetCyclicRows,
//   ]);

//   const handleTestSelection = (event, handleTableEditChanges) => {
//     let selectedValue;
//     if (handleTableEditChanges) {
//       selectedValue = event;
//       setSelectedTest(event);
//     } else {
//       selectedValue = parseInt(event.target.value);
//       setSelectedTest(selectedValue);
//     }

//     if (selectedValue == null) {
//       setSetPoint(0);
//       setHoldTime(0);
//       setPositiveSetPoint(0);
//       setNegativeSetPoint(0);
//       setNumberOfCycles(0);
//       return;
//     }

//     console.log("selected is ", selectedValue);
//     if (toggle === "dynamic_load") {
//       if (custom_preset_toggle === "Preset") {
//         // For preset cyclic tests, we only allow the next unfinished test
//         const nextTest = getNextUnfinishedCyclicTest();
//         if (nextTest) {
//           setSelectedTestCyclicIndex(nextTest.index);
//           setButtonName(
//             nextTest.resume && status === "idle" ? "Resume" : "Start"
//           );
//           setButtonClass(
//             nextTest.resume && status === "idle"
//               ? "btn btn-warning btn-lg"
//               : "btn btn-success btn-lg"
//           );
//           setPositiveSetPoint(nextTest.high_pressure);
//           setNegativeSetPoint(nextTest.low_pressure);
//           setNumberOfCycles(nextTest.cycles);
//           setTestID(nextTest.id || null);
//           console.log("Setting test index to", nextTest.index);
//           setTestIndex(nextTest.index);
//           dispatch(
//             devicesActions.setAllPageStatus({
//               deviceID,
//               wardToggle: nextTest.type,
//             })
//           );
//         }
//       } else {
//         if (selectedValue >= 0 && selectedValue < customCyclicRows.length) {
//           const row = customCyclicRows[selectedValue];
//           setButtonName("Start");
//           setButtonClass("btn btn-success btn-lg");
//           setPositiveSetPoint(row.high_pressure);
//           setNegativeSetPoint(row.low_pressure);
//           setNumberOfCycles(row.cycles);
//           setTestID(null);
//           console.log("Setting test index to", row.index);
//           setTestIndex(row.index);
//           dispatch(
//             devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
//           );
//         } else {
//           setPositiveSetPoint(0);
//           setNegativeSetPoint(0);
//           setNumberOfCycles(0);
//         }
//       }
//     } else if (toggle === "static_load") {
//       if (custom_preset_toggle === "Preset") {
//         const availableStaticTests = getAvailablePresetStaticTests();
//         if (selectedValue >= 0 && selectedValue < availableStaticTests.length) {
//           const row = availableStaticTests[selectedValue];
//           setSetPoint(row.pressure);
//           setHoldTime(row.duration);
//           setTestID(null);
//           console.log("Setting test index to", row.index);
//           setTestIndex(row.index);
//           dispatch(
//             devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
//           );
//         }
//       } else {
//         const availableCustomStaticTests = getAvailableCustomStaticTests();
//         if (selectedValue >= 0 && selectedValue < availableCustomStaticTests.length) {
//           const row = availableCustomStaticTests[selectedValue];
//           setSetPoint(row.pressure);
//           setHoldTime(row.duration);
//           setTestID(null);
//           console.log("Setting test index to", row.index);
//           setTestIndex(row.index);
//           dispatch(
//             devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
//           );
//         } else {
//           setSetPoint(0);
//           setHoldTime(0);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     setSelectedTest(null);
//   }, [toggle, custom_preset_toggle]);

//   useEffect(() => {
//     if (status !== "idle") return;
        
//     if (custom_preset_toggle === "Preset" && toggle === "dynamic_load") {
//       // Auto-select the next unfinished test for preset cyclic
//       const nextTest = getNextUnfinishedCyclicTest();
//       if (nextTest) {
//         handleTestSelection(0, true);
//       }
//     } else if (custom_preset_toggle === "Preset") {
//       if (toggle === "static_load" && getAvailablePresetStaticTests().length > 0) {
//         handleTestSelection({ target: { value: "0" } });
//       }
//     } else {
//       if (toggle === "dynamic_load" && customCyclicRows.length > 0 && areAllPresetTestsFinished()) {
//         handleTestSelection({ target: { value: "0" } });
//       } else if (toggle === "static_load" && getAvailableCustomStaticTests().length > 0) {
//         handleTestSelection({ target: { value: "0" } });
//       }
//     }
//   }, [toggle, custom_preset_toggle]);

//   // Get the next unfinished test for display in dropdown
//   const nextUnfinishedTest = getNextUnfinishedCyclicTest();
//   const availableStaticTests = getAvailablePresetStaticTests();
//   const availableCustomStaticTests = getAvailableCustomStaticTests();

//   return (
//     <div className="row">
//       <div className="col-12 col-md-6 col-xl-3 mt-3">
//         <ToggleButtonGeneral
//           label1="Custom"
//           label2="Preset"
//           onToggleChange={handleToggleChange}
//           custom_preset_toggle={custom_preset_toggle}
//           disabled={status !== "idle"}
//           textColor="white"
//         />
//       </div>

//       <div className="col-12 col-md-6 col-xl-5 mt-3">
//         <select
//           className="form-select form-select-lg"
//           style={{ width: "300px", maxWidth: "inherit" }}
//           onChange={handleTestSelection}
//           value={selectedTest !== null ? selectedTest : ""}
//           disabled={status !== "idle"}
//         >
//           <option value="" disabled>
//             {custom_preset_toggle === "Preset"
//               ? "Available Preset Tests"
//               : "Available Custom Tests"}
//           </option>

//           {custom_preset_toggle === "Preset" ? (
//             toggle === "dynamic_load" ? (
//               nextUnfinishedTest ? (
//                 <option key={nextUnfinishedTest.index} value={0}>
//                   {`Test ${nextUnfinishedTest.index + 1} ${nextUnfinishedTest.type}`}
//                 </option>
//               ) : (
//                 <option disabled>No Unfinished Tests Available</option>
//               )
//             ) : toggle === "static_load" && availableStaticTests.length > 0 ? (
//               availableStaticTests.map((row, index) => (
//                 <option key={row.index} value={index}>
//                   {`Preset Test ${row.index + 1} ${row.type}`}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No Preset Tests</option>
//             )
//           ) : toggle === "dynamic_load" && customCyclicRows.length > 0 && areAllPresetTestsFinished() ? (
//             customCyclicRows.map((row, index) => (
//               <option key={index} value={index}>
//                 {`Custom Test ${index + 1} ${row.type}`}
//               </option>
//             ))
//           ) : toggle === "static_load" && availableCustomStaticTests.length > 0 ? (
//             availableCustomStaticTests.map((row, index) => (
//               <option key={row.index} value={index}>
//                 {`Custom Test ${row.index + 1} ${row.type}`}
//               </option>
//             ))
//           ) : (
//             <option disabled>
//               {toggle === "dynamic_load" && !areAllPresetTestsFinished()
//                 ? "Complete preset tests first"
//                 : "No Custom Tests"}
//             </option>
//           )}
//         </select>
//       </div>

//       <div className="col-12 col-md-6 col-xl-4">
//         <ControlsButton
//           deviceID={deviceID}
//           buttonClass={buttonClass}
//           handleStartBtn={handleStartBtn}
//           buttonName={buttonName}
//           status={status}
//           selectedSensor={selectedSensor}
//           ref3={ref3}
//           disabled={
//             selectedTest === null ||
//             (custom_preset_toggle === "Preset" && toggle === "dynamic_load" && !nextUnfinishedTest)
//           }
//           customPresetToggle={custom_preset_toggle}
//           project_id={project_id}
//           cyclic_test_index={selectedTestCyclicIndex}
//           setButtonName={setButtonName}
//           setButtonClass={setButtonClass}
//         />
//       </div>
//     </div>
//   );
// };

// export default Controls;


import ControlsButton from "./ControlsButton";
import "./Controls.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import ToggleButtonGeneral from "../ToggleButtonGeneral/ToggleButtonGeneral";

const Controls = ({
  deviceID,
  buttonClass,
  handleStartBtn,
  buttonName,
  status,
  selectedSensor,
  ref3,
  setSetPoint,
  setHoldTime,
  setPositiveSetPoint,
  setNegativeSetPoint,
  setNumberOfCycles,
  setTestID,
  setButtonName,
  setButtonClass,
  project_id,
  setTestIndex,
  selectedTest,
  setSelectedTest,
  // Add these new props for handling add custom row modal
  onAddCustomRow, // Function to open the add custom row modal
}) => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);

  const toggle = neededDevice.toggle;
  const custom_preset_toggle = neededDevice.custom_preset_toggle;
  const presetCyclicRows = neededDevice.presetCyclicRows || [];
  const customCyclicRows = neededDevice.customCyclicRows || [];
  const presetStaticRows = neededDevice.presetStaticRows || [];
  const customStaticRows = neededDevice.customStaticRows || [];

  const [selectedTestCyclicIndex, setSelectedTestCyclicIndex] = useState(null);

  // Get the next unfinished preset cyclic test
  const getNextUnfinishedCyclicTest = () => {
    if (toggle === "dynamic_load" && custom_preset_toggle === "Preset") {
      const sortedTests = [...presetCyclicRows].sort((a, b) => a.index - b.index);
      return sortedTests.find(test => !test.finished) || null;
    }
    return null;
  };

  // Check if all preset tests are finished
  const areAllPresetTestsFinished = () => {
    if (toggle === "dynamic_load") {
      return presetCyclicRows.every(test => test.finished) || presetCyclicRows.length === 0;
    }
    return true; // For static loads, we don't enforce this sequence
  };

  // Get available unfinished preset static tests
  const getAvailablePresetStaticTests = () => {
    return presetStaticRows.filter(test => test.finished !== true);
  };

  // Get available unfinished custom static tests
  const getAvailableCustomStaticTests = () => {
    return customStaticRows.filter(test => test.finished !== true);
  };

  const handleToggleChange = (newValue) => {
    dispatch(
      devicesActions.readCustomPresetToggle({
        deviceID,
        value: newValue,
      })
    );
    setSelectedTest(null);

    let testsAvailable = false;

    if (newValue === "Preset") {
      if (toggle === "dynamic_load") {
        testsAvailable =
          presetCyclicRows.filter((test) => !test.finished).length > 0;
      } else if (toggle === "static_load") {
        testsAvailable = getAvailablePresetStaticTests().length > 0;
      }
    } else if (newValue === "Custom") {
      if (toggle === "dynamic_load") {
        testsAvailable = customCyclicRows.length > 0 && areAllPresetTestsFinished();
      } else if (toggle === "static_load") {
        testsAvailable = getAvailableCustomStaticTests().length > 0;
      }
    }

    if (!testsAvailable) {
      setSetPoint(0);
      setHoldTime(0);
      setPositiveSetPoint(0);
      setNegativeSetPoint(0);
      setNumberOfCycles(0);
      setTestID(null);
      setButtonName("Start");
      setButtonClass("btn btn-success btn-lg");
    }

    if (newValue === "Custom") {
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID,
          wardToggle: "inward",
        })
      );
    }
  };

  useEffect(() => {
    handleTestSelection(selectedTest, true);
  }, [
    neededDevice.customStaticRows,
    neededDevice.customCyclicRows,
    neededDevice.presetStaticRows,
    neededDevice.presetCyclicRows,
  ]);

  const handleTestSelection = (event, handleTableEditChanges) => {
    let selectedValue;
    if (handleTableEditChanges) {
      selectedValue = event;
      setSelectedTest(event);
    } else {
      selectedValue = event.target.value;
      
      // Handle the special case for "add_custom_row"
      if (selectedValue === "add_custom_row") {
        if (onAddCustomRow) {
          onAddCustomRow(); // Call the function to open add custom row modal
        }
        return; // Don't process this as a regular test selection
      }
      
      selectedValue = parseInt(selectedValue);
      setSelectedTest(selectedValue);
    }

    if (selectedValue == null) {
      setSetPoint(0);
      setHoldTime(0);
      setPositiveSetPoint(0);
      setNegativeSetPoint(0);
      setNumberOfCycles(0);
      return;
    }

    console.log("selected is ", selectedValue);
    if (toggle === "dynamic_load") {
      if (custom_preset_toggle === "Preset") {
        // For preset cyclic tests, we only allow the next unfinished test
        const nextTest = getNextUnfinishedCyclicTest();
        if (nextTest) {
          setSelectedTestCyclicIndex(nextTest.index);
          setButtonName(
            nextTest.resume && status === "idle" ? "Resume" : "Start"
          );
          setButtonClass(
            nextTest.resume && status === "idle"
              ? "btn btn-warning btn-lg"
              : "btn btn-success btn-lg"
          );
          setPositiveSetPoint(nextTest.high_pressure);
          setNegativeSetPoint(nextTest.low_pressure);
          setNumberOfCycles(nextTest.cycles);
          setTestID(nextTest.id || null);
          console.log("Setting test index to", nextTest.index);
          setTestIndex(nextTest.index);
          dispatch(
            devicesActions.setAllPageStatus({
              deviceID,
              wardToggle: nextTest.type,
            })
          );
        }
      } else {
        if (selectedValue >= 0 && selectedValue < customCyclicRows.length) {
          const row = customCyclicRows[selectedValue];
          setButtonName("Start");
          setButtonClass("btn btn-success btn-lg");
          setPositiveSetPoint(row.high_pressure);
          setNegativeSetPoint(row.low_pressure);
          setNumberOfCycles(row.cycles);
          setTestID(null);
          console.log("Setting test index to", row.index);
          setTestIndex(row.index);
          dispatch(
            devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
          );
        } else {
          setPositiveSetPoint(0);
          setNegativeSetPoint(0);
          setNumberOfCycles(0);
        }
      }
    } else if (toggle === "static_load") {
      if (custom_preset_toggle === "Preset") {
        const availableStaticTests = getAvailablePresetStaticTests();
        if (selectedValue >= 0 && selectedValue < availableStaticTests.length) {
          const row = availableStaticTests[selectedValue];
          setSetPoint(row.pressure);
          setHoldTime(row.duration);
          setTestID(null);
          console.log("Setting test index to", row.index);
          setTestIndex(row.index);
          dispatch(
            devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
          );
        }
      } else {
        const availableCustomStaticTests = getAvailableCustomStaticTests();
        if (selectedValue >= 0 && selectedValue < availableCustomStaticTests.length) {
          const row = availableCustomStaticTests[selectedValue];
          setSetPoint(row.pressure);
          setHoldTime(row.duration);
          setTestID(null);
          console.log("Setting test index to", row.index);
          setTestIndex(row.index);
          dispatch(
            devicesActions.setAllPageStatus({ deviceID, wardToggle: row.type })
          );
        } else {
          setSetPoint(0);
          setHoldTime(0);
        }
      }
    }
  };

  useEffect(() => {
    setSelectedTest(null);
  }, [toggle, custom_preset_toggle]);

  useEffect(() => {
    if (status !== "idle") return;
        
    if (custom_preset_toggle === "Preset" && toggle === "dynamic_load") {
      // Auto-select the next unfinished test for preset cyclic
      const nextTest = getNextUnfinishedCyclicTest();
      if (nextTest) {
        handleTestSelection(0, true);
      }
    } else if (custom_preset_toggle === "Preset") {
      if (toggle === "static_load" && getAvailablePresetStaticTests().length > 0) {
        handleTestSelection({ target: { value: "0" } });
      }
    } else {
      if (toggle === "dynamic_load" && customCyclicRows.length > 0 && areAllPresetTestsFinished()) {
        handleTestSelection({ target: { value: "0" } });
      } else if (toggle === "static_load" && getAvailableCustomStaticTests().length > 0) {
        handleTestSelection({ target: { value: "0" } });
      }
    }
  }, [toggle, custom_preset_toggle]);

  // Get the next unfinished test for display in dropdown
  const nextUnfinishedTest = getNextUnfinishedCyclicTest();
  const availableStaticTests = getAvailablePresetStaticTests();
  const availableCustomStaticTests = getAvailableCustomStaticTests();

  // Helper function to render dropdown options
  const renderDropdownOptions = () => {
    const options = [];
    
    if (custom_preset_toggle === "Preset") {
      if (toggle === "dynamic_load") {
        if (nextUnfinishedTest) {
          options.push(
            <option key={nextUnfinishedTest.index} value={0}>
              {`Test ${nextUnfinishedTest.index + 1} ${nextUnfinishedTest.type}`}
            </option>
          );
        } else {
          options.push(
            <option key="no-tests" disabled>No Unfinished Tests Available</option>
          );
        }
      } else if (toggle === "static_load" && availableStaticTests.length > 0) {
        availableStaticTests.forEach((row, index) => {
          options.push(
            <option key={row.index} value={index}>
              {`Preset Test ${row.index + 1} ${row.type}`}
            </option>
          );
        });
      } else {
        options.push(
          <option key="no-preset" disabled>No Preset Tests</option>
        );
      }
    } else {
      // Custom tests
      if (toggle === "dynamic_load" && customCyclicRows.length > 0 && areAllPresetTestsFinished()) {
        customCyclicRows.forEach((row, index) => {
          options.push(
            <option key={index} value={index}>
              {`Custom Test ${index + 1} ${row.type}`}
            </option>
          );
        });
      } else if (toggle === "static_load" && availableCustomStaticTests.length > 0) {
        availableCustomStaticTests.forEach((row, index) => {
          options.push(
            <option key={row.index} value={index}>
              {`Custom Test ${row.index + 1} ${row.type}`}
            </option>
          );
        });
      } else {
        options.push(
          <option key="no-custom" disabled>
            {toggle === "dynamic_load" && !areAllPresetTestsFinished()
              ? "Complete preset tests first"
              : "No Custom Tests"}
          </option>
        );
      }
      
      // Add the "Add Custom Row" option for custom tests when status is idle
if (status === "idle" && onAddCustomRow) {
  options.push(
    <option key="add-custom" value="add_custom_row" style={{ 
      backgroundColor: '#28a745', 
      color: 'white',
      fontWeight: 'bold'
    }}>
      + Add Custom Row
    </option>
  );
}
    }
    
    return options;
  };

  return (
    <div className="row">
      <div className="col-12 col-md-6 col-xl-3 mt-3">
        <ToggleButtonGeneral
          label1="Custom"
          label2="Preset"
          onToggleChange={handleToggleChange}
          custom_preset_toggle={custom_preset_toggle}
          disabled={status !== "idle"}
          textColor="white"
        />
      </div>

      <div className="col-12 col-md-6 col-xl-5 mt-3">
        <select
          className="form-select form-select-lg"
          style={{ width: "300px", maxWidth: "inherit" }}
          onChange={handleTestSelection}
          value={selectedTest !== null ? selectedTest : ""}
          disabled={status !== "idle"}
        >
          <option value="" disabled>
            {custom_preset_toggle === "Preset"
              ? "Available Preset Tests"
              : "Available Custom Tests"}
          </option>

          {renderDropdownOptions()}
        </select>
      </div>

      <div className="col-12 col-md-6 col-xl-4">
        <ControlsButton
          deviceID={deviceID}
          buttonClass={buttonClass}
          handleStartBtn={handleStartBtn}
          buttonName={buttonName}
          status={status}
          selectedSensor={selectedSensor}
          ref3={ref3}
          disabled={
            selectedTest === null ||
            (custom_preset_toggle === "Preset" && toggle === "dynamic_load" && !nextUnfinishedTest)
          }
          customPresetToggle={custom_preset_toggle}
          project_id={project_id}
          cyclic_test_index={selectedTestCyclicIndex}
          setButtonName={setButtonName}
          setButtonClass={setButtonClass}
        />
      </div>
    </div>
  );
};

export default Controls;