import React, { useEffect, useRef, useState } from "react";
import classes from "./ValvesCommon.module.css";
import { useDispatch, useSelector } from "react-redux";
import HookMqtt from "../Mqtt1";
import axios from "axios";
import { reloadBootstrapData } from "../../store/sensors-slice";
import { generalActions } from "../../store/general-slice";

// The backend's Airtable sync health. It returns a purpose-built `led` field
// ("green" | "amber" | "red") plus `status`, one of the four contractual words
// Synced / Pending / Sync Failed / Retry Required.
const SYNC_API_URL = `http://${window.location.hostname}:8000/sync/status`;

const ValvesCommon = () => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const commonValves = useSelector((state) => state.devices["commonValves"]);
  // null = loading/failed fetch, otherwise "green" | "amber" | "red"
  const [syncValue, setSyncValue] = useState(null);
  const [syncStatus, setSyncStatus] = useState("");
  // The revision the app data was last reloaded for.
  const reloadedRevisionRef = useRef(null);
  const isReloadingRef = useRef(false);

  console.log("check valves => commonValves = ", commonValves);

  useEffect(() => {
    let isMounted = true;

    const softReloadAppData = async () => {
      if (isReloadingRef.current) {
        return;
      }

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
        const { data } = await axios.get(SYNC_API_URL);

        if (!isMounted) {
          return;
        }

        const led = data?.led;
        if (led !== "green" && led !== "amber" && led !== "red") {
          setSyncValue(null);
          return;
        }

        setSyncValue(led);
        setSyncStatus(data.status || "");

        // `revision` moves when a pull brought new data down, which is the
        // signal the app's cached config is stale. The old 0/1 endpoint had no
        // equivalent, so it reloaded whenever the LED went red instead.
        const revision = data.revision ?? null;
        if (reloadedRevisionRef.current === null) {
          reloadedRevisionRef.current = revision;
        } else if (revision !== reloadedRevisionRef.current) {
          reloadedRevisionRef.current = revision;
          softReloadAppData();
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
                      syncValue === "green"
                        ? classes.offManual
                        : syncValue === "amber"
                        ? classes.syncAmber
                        : classes.onManual
                    }
                    style={{ cursor: "default" }}
                    title={syncStatus}
                    aria-label={`Sync: ${syncStatus || syncValue}`}
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
