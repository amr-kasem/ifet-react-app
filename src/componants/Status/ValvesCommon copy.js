import React from "react";
import classes from "./status.module.css";
import { useSelector } from "react-redux";
import { useRef } from "react";
import HookMqtt from "../Mqtt1";

const ValvesCommon = () => {
  const ref3 = useRef();
  const commonValves = useSelector((state) => state.devices["commonValves"]);
  console.log("check valves => commonValves = ", commonValves);

  const valvesHandle = () => {
    const valvesList = Object.entries(commonValves).map(([key, value]) => ({
      ...value,
      id: key, // Add an 'id' field to preserve the original key
    }));

    return valvesList.map((valve) => (
      <td key={valve.name}>
        { valve.value == 0 ? (
          <div
            onClick={() => {
              const message = 1;
              ref3.current.mqttPub({
                topic: `/turbo/valves/${valve.name}`,
                qos: 1,
                payload: JSON.stringify(message),
              });
            }}
            className={classes.offManual}
          ></div>
        ) : valve.value == 1 ? (
          <div
            onClick={() => {
              const message = 0;
              ref3.current.mqttPub({
                topic: `/turbo/valves/${valve.name}`,
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
      <HookMqtt ref={ref3} topics={[]} />
      <h4>Valves</h4>
      <div className="table-responsive">
        <table className="table text-center table-bordered">
          <thead className="table-dark">
            <tr>
              {commonValves.map((valve) => (
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

export default ValvesCommon;
