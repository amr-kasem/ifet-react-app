import React, { useRef, useEffect, useState } from "react";
import HookMqtt from "../Mqtt1";
import Valves from "./Valves";
import Sensors from "./Sensors";
import StatusOfOperation from "./StatusOfOperation";
import Others from "./Others";
import panelStyles from "./StatusPanel.module.css";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";

const Status = ({
  showValves = true,
  showSensors = true,
  showOthers = true,
  showStatus = true,
  // Opt-in: the styled panel that fills the height beside the device card.
  // The slave-mode variant renders valves only and is left as it was.
  panel = false,
  ...props
}) => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const deviceData = props.deviceData;
  const deviceID = deviceData.deviceID;

  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);
  const toggleBtn = neededDevice.toggleBtn;

  const [temperature, setTemperature] = useState(neededDevice.Temperature);
  const [humidity, setHumidity] = useState(neededDevice.Humidity);

  useEffect(() => {
    setTemperature(neededDevice.Temperature);
    setHumidity(neededDevice.Humidity);
  }, [neededDevice.Temperature, neededDevice.Humidity]);

  const handleTemperatureChange = (event) => {
    const newTemperature = event.target.value;
    setTemperature(newTemperature);
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID,
        Temperature: newTemperature,
      })
    );
  };

  const handleHumidityChange = (event) => {
    const newHumidity = event.target.value;
    setHumidity(newHumidity);
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID,
        Humidity: newHumidity,
      })
    );
  };

  const startInterval = () => {
    ref3.current.mqttPub({
      topic: `device${deviceID}/sensors/humidity`,
      qos: 1,
      payload: JSON.stringify(humidity),
    });
    ref3.current.mqttPub({
      topic: `device${deviceID}/sensors/temperature`,
      qos: 1,
      payload: JSON.stringify(temperature),
    });
  };

  return (
    <>
      <HookMqtt ref={ref3} topics={[]} />
      {/* <div className="col-4"> */}
      <div className={`col-4 ${props.className || ""}`}>
        <div className={panel ? panelStyles.panel : undefined}>
          {showStatus && <StatusOfOperation status={deviceData.status} />}
          {showSensors && (
            <Sensors deviceData={deviceData} toggleBtn={toggleBtn} />
          )}
          {showOthers && (
            <div className={panel ? panelStyles.conditions : undefined}>
              <h4>Conditions</h4>
              <Others
                temperature={temperature}
                humidity={humidity}
                handleTemperatureChange={handleTemperatureChange}
                handleHumidityChange={handleHumidityChange}
                startInterval={startInterval}
              />
            </div>
          )}
          {showValves && (
            <Valves
              deviceID={deviceID}
              neededDevice={neededDevice}
              ref3={ref3}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Status;
