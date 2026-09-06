import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import ButtonWithChoices from "../ButtonWithChoices/ButtonWithChoices";
import axios from "axios";
import DeviceTurboModal from "../Modals/DeviceTurboModal";

const LOAD_TYPE_OPTIONS = [
  { label: "Static Load", value: "static_load", disabled: false },
  { label: "Cyclic Load", value: "dynamic_load", disabled: false },
  { label: "Impact", value: "impact", disabled: true },
  { label: "Forced Entry", value: "forced_entry", disabled: true },
  { label: "ANSI Z97.1", value: "ansi_z97_1", disabled: true },
];

const DeviceHeader = (props) => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find(
    (device) => device.deviceID === props.deviceID
  );

  const [switchValue, setSwitchValue] = useState(neededDevice.toggle);
  const [switchTurboValue, setSwitchTurboValue] = useState(neededDevice.Turbo);
  const [deviceTurboSelected, setDeviceTurboSelected] = useState(
    props.devicesNames.filter(
      (name) =>
        name !== neededDevice.deviceName &&
        !devices.find((device) => device.deviceName === name)?.turbo_slave
    )[0]
  );
  const [selectedChoice, setSelectedChoice] = useState("Normal");
  const [previousChoice, setPreviousChoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  useEffect(() => {
    if (selectedChoice !== null) {
      setPreviousChoice(selectedChoice);
    }
  }, [selectedChoice]);

  useEffect(() => {
    console.log("check turbo_slave = " + neededDevice.turbo_slave)
    console.log("check turbo_mode = " + neededDevice.turbo_mode)
    if (neededDevice.turbo_slave) {
      setSelectedChoice("Slave");
      dispatch(
        devicesActions.readDisable({
          deviceID: props.deviceID,
          value: true,
        })
      );
    } else if (neededDevice.turbo_mode) {
      setSelectedChoice("Turbo");
    }
  }, [neededDevice.turbo_slave, neededDevice.turbo_mode]);

  const handleDeviceTurboSelectedChange = (e) => {
    const selectedDeviceName = e.target.value;
    setDeviceTurboSelected(selectedDeviceName);
    const selectedDeviceID = devices.find(
      (device) => device.deviceName === selectedDeviceName
    )?.deviceID;

    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.deviceID,
        turbo_charger: selectedDeviceID,
      })
    );
  };

  useEffect(() => {
    setSwitchValue(neededDevice.toggle);
  }, [neededDevice.toggle]);

  useEffect(() => {
    setSwitchTurboValue(neededDevice.Turbo);
  }, [neededDevice.Turbo]);

  const handleChoice = (choice) => {
    console.log("Previous choice:", previousChoice);
    console.log("New choice:", choice);

    const slave_id = devices.find(
      (device) => device.deviceName === deviceTurboSelected
    )?.deviceID;

    let payload;

    const showError = (error) => {
      setErrorMessage(error.response?.data?.detail || error.message);
      setTimeout(() => setErrorMessage(""), 2000); // Clear message after 1 second
    };

    if (choice === "Turbo") {
      if(previousChoice !== "Slave"){
        setIsModalOpen(true); // Open modal when Turbo is selected
      }
      // payload = { slave_id, turbo_mode: true };
      // axios
      //   .put(
      //     `http://${window.location.hostname}:8000/devices/${props.deviceID}/turbo_master`,
      //     payload,
      //     {
      //       headers: { "Content-Type": "application/json" },
      //     }
      //   )
      //   .then((response) => {
      //     console.log("Turbo response:", response.data);
      //     setSelectedChoice(choice);
      //   })
      //   .catch(showError);

    }
    else if (choice === "Slave") {
      payload = { slave_mode: true };
      axios
        .put(
          `http://${window.location.hostname}:8000/devices/${props.deviceID}/turbo_slave`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          console.log("Slave response:", response.data);
          setSelectedChoice(choice);
          // test
          const device = response.data;
          console.log(device);
          dispatch(
            devicesActions.readDisable({
              deviceID: props.deviceID,
              value: device.turbo_slave,
            })
          );
          // test
        })
        .catch(showError);
    } else if (choice === "Normal") {
      if (previousChoice === "Slave") {
        axios
          .put(
            `http://${window.location.hostname}:8000/devices/${props.deviceID}/turbo_slave`,
            { slave_mode: false },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((response) => {
            console.log("Normal mode response:", response.data);
            setSelectedChoice(choice);
            // test
            const device = response.data;
            console.log(device);
            dispatch(
              devicesActions.readDisable({
                deviceID: props.deviceID,
                value: device.turbo_slave,
              })
            );
          })
          .catch(showError);
      } else if (previousChoice === "Turbo") {
        axios
          .put(
            `http://${window.location.hostname}:8000/devices/${props.deviceID}/turbo_master`,
            {
              slave_id,
              turbo_mode: false,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((response) => {
            console.log("Normal turbo response:", response.data);
            setSelectedChoice(choice);
          })
          .catch(showError);
      }
    }

    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.deviceID,
        Turbo: choice,
      })
    );
    dispatch(
      devicesActions.readTurbo({
        deviceID: props.deviceID,
        value: choice,
      })
    );
  };

  const handleToggleChange = (e) => {
    const selectedOption = LOAD_TYPE_OPTIONS.find(
      (option) => option.label === e.target.value
    );
    if (!selectedOption || selectedOption.disabled) {
      return;
    }

    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.deviceID,
        toggle: selectedOption.value,
      })
    );

    dispatch(
      devicesActions.readToggle({
        deviceID: props.deviceID,
        value: selectedOption.value,
      })
    );
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };


  return (
    <div className="d-flex">
      <h4 className="flex-grow-1">Device {props.deviceID}</h4>

      {/* <select
        className="form-select form-select-lg"
        aria-label=".form-select-lg example"
        id="device_name"
        value={deviceTurboSelected}
        onChange={handleDeviceTurboSelectedChange}
        style={{ width: "150px" }}
      >
        {props.devicesNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select> */}

      <ButtonWithChoices
        key={props.deviceID}
        choices={["Normal", "Turbo", "Slave"]}
        onSelect={handleChoice}
        selectedChoice={selectedChoice}
        id={props.deviceID}
        disabled={props.status !== "idle"}
      />

      <select
        className="form-select form-select-lg"
        aria-label="Load type"
        value={
          LOAD_TYPE_OPTIONS.find((option) => option.value === switchValue)
            ?.label || "Static Load"
        }
        onChange={handleToggleChange}
        disabled={props.status !== "idle" || props.isDisabled}
        style={{ width: "180px", color: "black" , marginLeft: "10px"}}
      >
        {LOAD_TYPE_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.label}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Turbo Modal */}
      {isModalOpen && (
        <DeviceTurboModal
          deviceID={props.deviceID}
          devices={devices}
          setSelectedChoice = {setSelectedChoice}
          deviceTurboSelected = {deviceTurboSelected}
          setErrorMessage = {setErrorMessage}
          handleDeviceTurboSelectedChange = {handleDeviceTurboSelectedChange}
          onClose={closeModal} // Close modal on confirm or cancel
        />
      )}

      {errorMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DeviceHeader;