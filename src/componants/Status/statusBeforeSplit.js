//stable
import classes from "./status.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useEffect, useRef, useState } from "react";
import HookMqtt from "../Mqtt1";
import { devicesActions } from "../../store/sensors-slice";

const Status = (props) => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  let deviceData = props.deviceData;
  // console.log('deviceData',deviceData)

  const deviceID = props.deviceData.deviceID;
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);
  // console.log("neededDevice",neededDevice)
  const toggleBtn = neededDevice.toggleBtn;
  // console.log("valves",neededDevice.valves)
  // console.log("sensors",neededDevice.sensors)

  const getSensorsColumns = () => {
    const sensorsList = Object.entries(deviceData.sensors).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    // Filter sensors based on toggleBtn state
    const filteredSensors = sensorsList.filter(
      (sensor) =>
        toggleBtn === "static_load" ||
        (sensor.role === "pressure" && toggleBtn === "dynamic_load")
    );

    const columns = filteredSensors.map((sensor) => (
      <th key={sensor.id} scope="col">
        {sensor.name}
      </th>
    ));

    return columns;
  };

  const getSensorsData = () => {
    // console.log("omda",deviceData.sensors)
    const sensorsList = Object.entries(deviceData.sensors).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    // Filter sensors based on toggleBtn state
    const filteredSensors = sensorsList.filter(
      (sensor) =>
        toggleBtn === "static_load" ||
        (sensor.role === "pressure" && toggleBtn === "dynamic_load")
    );

    const dataCells = filteredSensors.map((sensor) => (
      <td key={sensor.id}>{sensor.value}</td>
    ));

    return dataCells;
  };

  const getValvesColumns = () => {
    const columns = [];
    for (const i in neededDevice.valves) {
      columns.push(
        <th key={neededDevice.valves[i].address} scope="col">
          {neededDevice.valves[i].name}
        </th>
      );
    }
    return columns;
  };

  const valvesHandle = () => {
    // console.log("deviceData",deviceData.valves)
    // console.log("neededDevice",neededDevice.valves)
    const valvesList = Object.entries(neededDevice.valves).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    const valves = valvesList;
    // console.log(valves)
    let x = [];
    valves.forEach((valve) => {
      // console.log(valve);
      x.push(
        <td key={valve.name}>
          {!valve.role.includes("MANUAL") && valve.value == 0 ? (
            <div className={classes.off}></div>
          ) : !valve.role.includes("MANUAL") && valve.value == 1 ? (
            <div className={classes.on}></div>
          ) : valve.role.includes("MANUAL") && valve.value == 0 ? (
            <div
              onClick={() => {
                // console.log("send to topic: " , `device${deviceID}/valves/${valve.name}` , "value = 1")
                const message = 1;
                ref3.current.mqttPub({
                  topic: `device${deviceID}/valves/${valve.name}`,
                  qos: 1,
                  payload: JSON.stringify(message),
                });
              }}
              className={classes.offManual}
            ></div>
          ) : valve.role.includes("MANUAL") && valve.value == 1 ? (
            <div
              onClick={() => {
                // console.log("send to topic: " , `device${deviceID}/valves/${valve.name}` , "value = 0")
                const message = 0;
                ref3.current.mqttPub({
                  topic: `device${deviceID}/valves/${valve.name}`,
                  qos: 1,
                  payload: JSON.stringify(message),
                });
              }}
              className={classes.onManual}
            ></div>
          ) : null}
        </td>
      );
    });
    return x;
  };

  useEffect(() => {
    publishData();
  }, []);

  const [humidity, setHumidity] = useState(neededDevice.Humidity);
  const [temperature, setTemperature] = useState(neededDevice.Temperature);
  const intervalIdRef = useRef(null); // Ref to store the interval ID

  useEffect(() => {
    setTemperature(neededDevice.Temperature);
    setHumidity(neededDevice.Humidity);
  }, [neededDevice.Temperature, neededDevice.Humidity]);

  const publishData = () => {
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
    // console.log("payload sent:", temperature, humidity);
  };

  const handleTemperatureChange = (event) => {
    const newTemperature = event.target.value;
    setTemperature(newTemperature);
    // localStorage.setItem("temperature", JSON.stringify(newTemperature));
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: deviceID,
        Temperature: newTemperature,
      })
    );
    // restartInterval();
  };

  const handleHumidityChange = (event) => {
    const newHumidity = event.target.value;
    setHumidity(newHumidity);
    // localStorage.setItem("humidity", JSON.stringify(newHumidity));
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: deviceID,
        Humidity: newHumidity,
      })
    );
    // restartInterval();
  };

  const startInterval = () => {
    // Clear any existing interval
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    // Start a new interval
    intervalIdRef.current = setInterval(publishData, 200);
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <HookMqtt ref={ref3} topics={[]} />
      <div className="col-4">
        <div className="row">
          <div className="col">
            <div className="d-flex">
              <h4 className="pt-1">Status: </h4>
              <div
                id="status"
                className="flex-grow-1 d-flex align-items-center"
                style={{
                  backgroundColor: "darkorange",
                  padding: "5px",
                  borderRadius: "5px",
                  fontSize: "20px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {deviceData.status}
              </div>
            </div>
            <div className="row mt-4">
              <h4>Sensors</h4>
            </div>
            <div className="table-responsive">
              <table
                className="table text-center table-bordered sensors-table"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="table-dark">
                  <tr>{getSensorsColumns()}</tr>
                </thead>
                <tbody>
                  <tr>{getSensorsData()}</tr>

                  <tr>
                    <td colSpan="4">
                      <div className="d-flex justify-content-around">
                        <div className="form-group mr-2">
                          <label htmlFor="temperature">Temperature</label>
                          <input
                            type="number"
                            className="form-control"
                            id="temperature"
                            placeholder="Enter number here"
                            onChange={handleTemperatureChange}
                            value={temperature}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="humidity">Humidity</label>
                          <input
                            type="number"
                            className="form-control"
                            id="humidity"
                            placeholder="Enter number here"
                            onChange={handleHumidityChange}
                            value={humidity}
                          />
                        </div>
                        <button
                          style={{ marginLeft: "5px" }}
                          type="button"
                          className="btn btn-success btn-lg"
                          onClick={startInterval}
                        >
                          Send
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="row">
              <h4>Valves</h4>
            </div>
            <div className="row">
              <div className="table-responsive">
                <table className="table text-center table-bordered">
                  <thead className="table-dark">
                    <tr>{getValvesColumns()}</tr>
                  </thead>
                  <tbody>
                    {/* <tr>{getValvesData()}</tr> */}
                    <tr>{valvesHandle()}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Status;
