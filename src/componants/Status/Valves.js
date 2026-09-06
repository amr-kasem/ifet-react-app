import React from "react";
import classes from "./status.module.css";

const Valves = ({ deviceID, neededDevice, ref3 }) => {

  // console.log("check valves => neededDevice.valves = " , neededDevice.valves)

  const valvesHandle = () => {
    const valvesList = Object.entries(neededDevice.valves).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    return valvesList.map((valve) => (
      <td key={valve.name}>
        {!valve.role.includes("MANUAL") && valve.value == 0 ? (
          <div className={classes.off}></div>
        ) : !valve.role.includes("MANUAL") && valve.value == 1 ? (
          <div className={classes.on}></div>
        ) : valve.role.includes("MANUAL") && valve.value == 0 ? (
          <div
            onClick={() => {
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
    ));
  };

  return (
    <div className="row">
      <h4>Valves</h4>
      <div className="table-responsive">
        <table className="table text-center table-bordered">
          <thead className="table-dark">
            <tr>
              {neededDevice.valves.map((valve) => (
                <th key={valve.address} scope="col">
                  {valve.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>{valvesHandle()}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Valves;
