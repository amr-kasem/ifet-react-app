import React, { useEffect, useRef, useState } from "react";
import classes from "./ValvesCommon.module.css";
import { useDispatch, useSelector } from "react-redux";
import HookMqtt from "../Mqtt1";
import axios from "axios";
import { reloadBootstrapData } from "../../store/sensors-slice";
import { generalActions } from "../../store/general-slice";

// Test Sync API (sync_test_api.py on port 8010). Change later to real backend path.
const SYNC_API_URL = `http://${window.location.hostname}:8010/sync`;

const ValvesCommon = () => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const commonValves = useSelector((state) => state.devices["commonValves"]);
  // null = loading/failed fetch, 0 = red, 1 = green
  const [syncValue, setSyncValue] = useState(null);
  const reloadedForZeroRef = useRef(false);
  const isReloadingRef = useRef(false);

  console.log("check valves => commonValves = ", commonValves);

  useEffect(() => {
    let isMounted = true;

    const softReloadAppData = async () => {
      if (isReloadingRef.current || reloadedForZeroRef.current) {
        return;
      }

      reloadedForZeroRef.current = true;
      isReloadingRef.current = true;

      try {
        await dispatch(reloadBootstrapData());
        dispatch(generalActions.bumpAppDataReload());
      } finally {
        isReloadingRef.current = false;
      }
    };

    const fetchSync = async () => {
      try {
        const response = await axios.get(SYNC_API_URL);
        const value = Number(response.data);

        if (!isMounted) {
          return;
        }

        if (value !== 0 && value !== 1) {
          setSyncValue(null);
          return;
        }

        setSyncValue(value);

        if (value === 0) {
          softReloadAppData();
        } else {
          // Sync back to 1 — allow next 0 to trigger another soft reload
          reloadedForZeroRef.current = false;
        }
      } catch (error) {
        if (isMounted) {
          setSyncValue(null);
        }
      }
    };

    fetchSync();
    const intervalId = setInterval(fetchSync, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [dispatch]);

  const valvesHandle = () => {
    const valvesList = Object.entries(commonValves).map(([key, value]) => ({
      ...value,
      id: key, // Add an 'id' field to preserve the original key
    }));

    return valvesList.map((valve) => (
      <td key={valve.name}>
        {valve.value === 0 ? (
          <div
            onClick={() => {
              const message = 1;
              ref3.current.mqttPub({
                topic: `turbo/valves/${valve.name}`,
                qos: 1,
                payload: JSON.stringify(message),
              });
            }}
            className={classes.offManual}
          ></div>
        ) : valve.value === 1 ? (
          <div
            onClick={() => {
              const message = 0;
              ref3.current.mqttPub({
                topic: `turbo/valves/${valve.name}`,
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
    <div className={classes.valvesContainer}>
      <HookMqtt ref={ref3} topics={[]} />
      {/* <h4>Common Valves</h4> */}
      <div className="table-responsive">
        {/* <table className={`table text-center table-bordered ${classes.valvesTable}`}> */}
        <table className={`table text-center table-bordered mb-0 ${classes.valvesTable}`}>
          <thead className="table-dark">
            <tr>
              <th scope="col">Sync</th>
              {commonValves.map((valve) => (
                <th key={valve.address} scope="col">
                  {valve.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {syncValue === null ? (
                  <div
                    className={classes.syncSpinner}
                    aria-label="Sync loading"
                  />
                ) : (
                  <div
                    className={
                      syncValue === 1 ? classes.offManual : classes.onManual
                    }
                    style={{ cursor: "default" }}
                  />
                )}
              </td>
              {valvesHandle()}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValvesCommon;
