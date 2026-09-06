import ControlsButton from "./ControlsButton";
import "./Controls.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import { useDispatch } from "react-redux";
import ToggleButtonGeneral from "../ToggleButtonGeneral/ToggleButtonGeneral";
import ToggleButtonForInOutWard from "../ToggleButtonGeneral/ToggleButtonForInOutWard";

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
  testID,
}) => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);

  const toggle = neededDevice.toggle;
  const CyclicTests = neededDevice.CyclicTests;
  const StaticTests = neededDevice.StaticTests;

  // useEffect(()=>{
  //   console.log("StaticTests in adjust = ",StaticTests)
  // },[StaticTests])

  // ///////////////////////////////////////
  const wardToggle = neededDevice.wardToggle;
  const [wardSwitchValue, setWardSwitchValue] = useState(wardToggle);

  const handleWardSwitchValueChange = (newValue) => {
    console.log(newValue)
    const selectedWard = newValue;
    setWardSwitchValue(selectedWard);

    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: deviceID,
        // wardToggle: selectedWard, // Use the deviceID instead of the device name
        wardToggle: newValue, // Use the deviceID instead of the device name
      })
    );
  };

  // Sync the local state when the toggle value changes in the store
  useEffect(() => {
    setWardSwitchValue(wardToggle);
  }, [wardToggle]);
  // ///////////////////////////////////////

  // useEffect(()=>{console.log("5dt baly")},[StaticTests,CyclicTests])

  // console.log("CyclicTests = ",CyclicTests)

  // Directly bind to the custom_preset_toggle in the Redux store
  const custom_preset_toggle = neededDevice.custom_preset_toggle;

  const handleToggleChange = (newValue) => {
    dispatch(
      devicesActions.readCustomPresetToggle({
        deviceID: deviceID,
        value: newValue,
      })
    );
    if (newValue === "Preset") {
      setSelectedTest(null);

      setSetPoint(0);
      setHoldTime(0);
      setPositiveSetPoint(0);
      setNegativeSetPoint(0);
      setNumberOfCycles(0);
      setTestID(null);
    } else if (newValue === "Custom") {
      setButtonName("Start"); //resume new update
      setButtonClass("btn btn-success btn-lg"); //resume new update
    }
  };

  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedTestCyclicIndex, setselectedTestCyclicIndex] = useState(null); // 3shan ab3t lamr el cancel/reset api
  const [selectedTestStaticIndex, setSelectedTestStaticIndex] = useState(0); // 3shan a7l moshklt select previous test

  // useEffect(()=>{
  //   console.log("selectedTest",selectedTest)
  // },[selectedTest])

  // Handle when a test is selected
  const handleTestSelection = (event) => {
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);
    setSelectedTest(selectedValue); // Update state when a test is selected

    if (toggle == "dynamic_load") {
      const selectedTest = CyclicTests.filter((test) => test.finished !== true)[
        selectedValue
      ];
      console.log("ccccccccccccccc", selectedTest);
      // console.log("test cyclic index",selectedTest.index)
      setselectedTestCyclicIndex(selectedTest.index);

      //resume new update start
      console.log("resume = ", selectedTest.resume); //resume new update
      if (selectedTest.resume && status === "idle") {
        setButtonName("Resume");
        setButtonClass("btn btn-warning btn-lg");
      } //resume new update
      else if (selectedTest.resume == false) {
        setButtonName("Start");
        setButtonClass("btn btn-success btn-lg");
      } 
      

      setPositiveSetPoint(selectedTest.high_pressure);
      setNegativeSetPoint(selectedTest.low_pressure);
      setNumberOfCycles(selectedTest.cycles);
      setTestID(selectedTest.id);
      // setWardSwitchValue(selectedTest.type); // inout problem
      dispatch(
        devicesActions.setAllPageStatus({
          deviceID: deviceID,
          wardToggle: selectedTest.type, // Use the deviceID instead of the device name
        })
      );
    } else if (toggle == "static_load") {
      // console.log("selectedValue ======== ",selectedValue)
      // console.log("StaticTests ======== ",StaticTests)
      // const selectedTest = StaticTests.filter((test) => test.finished !== true)[
      //   selectedValue
      // ];
      // console.log("selectedTest ======== ",selectedTest)

      const unfinishedTests = StaticTests.filter(
        (test) => test.finished !== true
      );
      console.log("Unfinished tests: ", unfinishedTests);
      if (selectedValue >= 0 && selectedValue < unfinishedTests.length && selectedValue!=null) {
        console.log(selectedValue)
        const selectedTest = unfinishedTests[selectedValue];
        console.log("Selected Test: ", selectedTest);
        setButtonName("Start"); //resume new update
        setButtonClass("btn btn-success btn-lg"); //resume new update
        setSetPoint(selectedTest.pressure);
        setHoldTime(selectedTest.duration);
        setTestID(selectedTest.id);
        dispatch(
          devicesActions.setAllPageStatus({
            deviceID: deviceID,
            wardToggle: selectedTest.type, // Use the deviceID instead of the device name
          })
        );
      } else {
        console.log("selectedValue is out of bounds!");
        const selectedTest = unfinishedTests[0];
        console.log("Selected Test: ", selectedTest);
        setButtonName("Start"); //resume new update
        setButtonClass("btn btn-success btn-lg"); //resume new update
        setSetPoint(selectedTest.pressure);
        setHoldTime(selectedTest.duration);
        setTestID(selectedTest.id);
        // setWardSwitchValue(selectedTest.type); // inout problem
        dispatch(
          devicesActions.setAllPageStatus({
            deviceID: deviceID,
            wardToggle: selectedTest.type, // Use the deviceID instead of the device name
          })
        );
      }

      // if(selectedTest !== undefined){
      //   setSelectedTestStaticIndex(selectedTest.index - 1)
      // }
      // console.log("ssssssssssssss", selectedTest);
    }
  };

  useEffect(() => {
    if (custom_preset_toggle === "Preset") {
      // Automatically select the first available test when CyclicTests or StaticTests change
      if (toggle === "dynamic_load") {
        const availableTests = CyclicTests.filter(
          (test) => test.finished !== true
        );
        if (availableTests.length > 0) {
          handleTestSelection({ target: { value: 0 } }); // Simulate selection of the first test
        }
      } else if (toggle === "static_load") {
        const availableTests = StaticTests.filter(
          (test) => test.finished !== true
        );
        if (availableTests.length > 0) {
          // handleTestSelection({ target: { value: selectedTestStaticIndex } }); // Simulate selection of the first test
          handleTestSelection({ target: { value: selectedTest } }); // Simulate selection of the first test
        }
      }
    }
  }, [CyclicTests, StaticTests, toggle]); // Dependency array to monitor changes

  return (
    <div className="row">
      {/* Left: Toggle Button */}
      <div className="col-12 col-md-6 col-xl-3 mt-3">
        <ToggleButtonGeneral
          label1="Custom"
          label2="Preset"
          onToggleChange={handleToggleChange}
          custom_preset_toggle={custom_preset_toggle} // Directly bind to Redux state here
          disabled={status !== "idle"}
          textColor="white"
        />
      </div>

      {/* Middle: Combobox */}
      {custom_preset_toggle === "Preset" ? (

        <div className="col-12 col-md-6 col-xl-5 mt-3">
          <select
            className="form-select form-select-lg"
            style={{ width: "300px", maxWidth: "inherit" }}
            onChange={handleTestSelection} // Handle selection
            defaultValue="" // Set default value to the placeholder option
          >
            <option value="" disabled>
              Available Tests
            </option>
            {/* Conditionally render CyclicTests or StaticTests based on toggle */}
            {toggle === "dynamic_load" && CyclicTests.length > 0 ? (
              // Filter CyclicTests to display only the first test where finished is true
              CyclicTests.filter((test) => test.finished !== true).length >
              0 ? (
                <option key={0} value={0}>
                  {/* {JSON.stringify(
                    CyclicTests.filter((test) => test.finished !== true)[0]
                  )}{" "} */}
                  Test {CyclicTests.find((test) => !test.finished).index + 1}{" "}
                  {CyclicTests.find((test) => !test.finished).type}
                  {/* Convert first finished object to string */}
                </option>
              ) : (
                <option disabled>No Finished Tests Available</option>
              )
            ) : toggle === "static_load" && StaticTests.length > 0 ? (
              // Filter StaticTests to display only the ones where finished = false
              StaticTests.filter((test) => test.finished !== true).length >
              0 ? (
                StaticTests.filter((test) => test.finished !== true).map(
                  (test, index) => (
                    <option key={index} value={index}>
                      {/* {JSON.stringify(test)}{" "} */}
                      {`Test ${test.index + 1} ${test.type}`}
                      {/* Convert each object to string */}
                    </option>
                  )
                )
              ) : (
                <option disabled>No Unfinished Tests Available</option>
              )
            ) : (
              <option disabled>No Tests Available</option>
            )}
          </select>
        </div>
      ) : (
        <div className="col-12 col-md-6 col-xl-5 mt-3">
          
          <ToggleButtonForInOutWard
            label1="inward"
            label2="outward"
            // checked={wardSwitchValue === "inward"} // Pass the current state
            defaultChecked={wardSwitchValue} // bdl checked for inward proplem
            onToggleChange={handleWardSwitchValueChange} // Pass the toggle handler function
            disabled={status !== "idle"} // Disable toggle when the status is not "idle"
            textColor="white"
          />
        </div>
      )}

      {/* Right: Controls Button */}
      <div className="col-12 col-md-6 col-xl-4">
        <ControlsButton
          deviceID={deviceID}
          buttonClass={buttonClass}
          handleStartBtn={handleStartBtn}
          buttonName={buttonName}
          status={status}
          selectedSensor={selectedSensor}
          ref3={ref3}
          // disabled={!selectedTest}
          disabled={selectedTest === null}
          customPresetToggle={custom_preset_toggle}
          // cancel button new version
          project_id={project_id}
          cyclic_test_index={selectedTestCyclicIndex}
          setButtonName = {setButtonName}
          setButtonClass = {setButtonClass}
        />
      </div>
    </div>
  );
};

export default Controls;
