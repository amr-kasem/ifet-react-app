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
  testID,
}) => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);

  const toggle = neededDevice.toggle;
  const CyclicTests = neededDevice.CyclicTests;
  const StaticTests = neededDevice.StaticTests;
  const customStaticRows = neededDevice.customStaticRows || [];
  const customCyclicRows = neededDevice.customCyclicRows || [];

  const custom_preset_toggle = neededDevice.custom_preset_toggle;

  const handleToggleChange = (newValue) => {
    dispatch(
      devicesActions.readCustomPresetToggle({
        deviceID: deviceID,
        value: newValue,
      })
    );

    setSelectedTest(null);

    let testsAvailable = false;

    if (newValue === "Preset") {
      if (toggle === "dynamic_load") {
        testsAvailable = CyclicTests.filter(test => !test.finished).length > 0;
      } else if (toggle === "static_load") {
        testsAvailable = StaticTests.filter(test => !test.finished).length > 0;
      }
    } else if (newValue === "Custom") {
      if (toggle === "static_load") {
        testsAvailable = customStaticRows.length > 0;
      } else if (toggle === "dynamic_load") {
        testsAvailable = customCyclicRows.length > 0;
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
          deviceID: deviceID,
          wardToggle: "inward",
        })
      );
    }
  };

  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedTestCyclicIndex, setselectedTestCyclicIndex] = useState(null);
  const [selectedTestStaticIndex, setSelectedTestStaticIndex] = useState(0);

  const handleTestSelection = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedTest(selectedValue);

    if (toggle === "dynamic_load") {
      const unfinishedTests = CyclicTests.filter(test => !test.finished);
      if (custom_preset_toggle === "Preset") {
        if (selectedValue >= 0 && selectedValue < unfinishedTests.length) {
          const selectedTest = unfinishedTests[selectedValue];

          setselectedTestCyclicIndex(selectedTest.index);
          if (selectedTest.resume && status === "idle") {
            setButtonName("Resume");
            setButtonClass("btn btn-warning btn-lg");
          } else {
            setButtonName("Start");
            setButtonClass("btn btn-success btn-lg");
          }

          setPositiveSetPoint(selectedTest.high_pressure);
          setNegativeSetPoint(selectedTest.low_pressure);
          setNumberOfCycles(selectedTest.cycles);
          setTestID(selectedTest.id);

          dispatch(
            devicesActions.setAllPageStatus({
              deviceID: deviceID,
              wardToggle: selectedTest.type,
            })
          );
        }
      } else if (custom_preset_toggle === "Custom") {
        if (selectedValue >= 0 && selectedValue < customCyclicRows.length) {
          const selectedCustomRow = customCyclicRows[selectedValue];

          setButtonName("Start");
          setButtonClass("btn btn-success btn-lg");

          setPositiveSetPoint(selectedCustomRow.high_pressure);
          setNegativeSetPoint(selectedCustomRow.low_pressure);
          setNumberOfCycles(selectedCustomRow.cycles);
          setTestID(null);

          dispatch(
            devicesActions.setAllPageStatus({
              deviceID: deviceID,
              wardToggle: selectedCustomRow.type,
            })
          );
        }
      }
    } else if (toggle === "static_load") {
      if (custom_preset_toggle === "Custom") {
        if (selectedValue >= 0 && selectedValue < customStaticRows.length) {
          const selectedCustomRow = customStaticRows[selectedValue];

          setButtonName("Start");
          setButtonClass("btn btn-success btn-lg");

          setSetPoint(selectedCustomRow.pressure);
          setHoldTime(selectedCustomRow.duration);
          setTestID(null);

          dispatch(
            devicesActions.setAllPageStatus({
              deviceID: deviceID,
              wardToggle: selectedCustomRow.type,
            })
          );
        }
      } else {
        const unfinishedTests = StaticTests.filter(test => !test.finished);
        if (selectedValue >= 0 && selectedValue < unfinishedTests.length) {
          const selectedTest = unfinishedTests[selectedValue];

          setButtonName("Start");
          setButtonClass("btn btn-success btn-lg");

          setSetPoint(selectedTest.pressure);
          setHoldTime(selectedTest.duration);
          setTestID(selectedTest.id);

          dispatch(
            devicesActions.setAllPageStatus({
              deviceID: deviceID,
              wardToggle: selectedTest.type,
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    setSelectedTest(null);
  }, [toggle, custom_preset_toggle]);

  useEffect(() => {
    if (custom_preset_toggle === "Preset") {
      if (toggle === "dynamic_load") {
        const availableTests = CyclicTests.filter(test => !test.finished);
        if (availableTests.length > 0) {
          handleTestSelection({ target: { value: "0" } });
        }
      } else if (toggle === "static_load") {
        const availableTests = StaticTests.filter(test => !test.finished);
        if (availableTests.length > 0 && selectedTest !== null) {
          handleTestSelection({ target: { value: selectedTest.toString() } });
        } else if (availableTests.length > 0) {
          handleTestSelection({ target: { value: "0" } });
        }
      }
    } else {
      if (toggle === "static_load" && customStaticRows.length > 0) {
        handleTestSelection({ target: { value: "0" } });
      } else if (toggle === "dynamic_load" && customCyclicRows.length > 0) {
        handleTestSelection({ target: { value: "0" } });
      }
    }
  }, [CyclicTests, StaticTests, customStaticRows, customCyclicRows, toggle, custom_preset_toggle]);

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
            {custom_preset_toggle === "Preset" ? "Available Preset Tests" : "Available Custom Tests"}
          </option>

          {custom_preset_toggle === "Preset" ? (
            toggle === "dynamic_load" && CyclicTests.length > 0 ? (
              CyclicTests.filter(test => !test.finished).length > 0 ? (
                CyclicTests.filter(test => !test.finished).map((test, index) => (
                  <option key={index} value={index}>
                    {`Test ${test.index + 1} ${test.type}`}
                  </option>
                ))
              ) : (
                <option disabled>No Unfinished Tests Available</option>
              )
            ) : toggle === "static_load" && StaticTests.length > 0 ? (
              StaticTests.filter(test => !test.finished).length > 0 ? (
                StaticTests.filter(test => !test.finished).map((test, index) => (
                  <option key={index} value={index}>
                    {`Test ${test.index + 1} ${test.type}`}
                  </option>
                ))
              ) : (
                <option disabled>No Unfinished Tests Available</option>
              )
            ) : (
              <option disabled>No Tests Available</option>
            )
          ) : (
            toggle === "static_load" && customStaticRows.length > 0 ? (
              customStaticRows.map((row, index) => (
                <option key={index} value={index}>
                  {`Custom Test ${index + 1} ${row.type}`}
                </option>
              ))
            ) : toggle === "dynamic_load" && customCyclicRows.length > 0 ? (
              customCyclicRows.map((row, index) => (
                <option key={index} value={index}>
                  {`Custom Test ${index + 1} ${row.type}`}
                </option>
              ))
            ) : (
              <option disabled>No Custom Tests Available</option>
            )
          )}
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
          disabled={selectedTest === null}
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
