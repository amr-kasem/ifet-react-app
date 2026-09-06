import React from "react";
import { useSelector } from "react-redux";
import styles from "./commonSensorsTable.module.css";

const CommonSensorsTable = () => {
  const sensors = useSelector((state) => state.devices.commonSensors);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.sensorsTable}>
        <tbody>
          {["Sensor ID", "Value", "Max Value","Permanent Value", "Assigned to"].map(
            (header, rowIndex) => (
              <tr key={header}>
                <th
                  style={{ backgroundColor: "rgb(33 37 41)", color: "white" }}
                >
                  {header}
                </th>
                {sensors.map((sensor) => (
                  <td
                    key={`${header}-${sensor.ID}`}
                    style={{
                      backgroundColor: "#eee",
                      color: "black",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {rowIndex === 0
                      ? sensor.ID
                      : rowIndex === 1
                      ? sensor.value
                      : rowIndex === 2
                      ? sensor.maxValue
                      : rowIndex === 3
                      ? sensor.PermanentValue
                      : sensor.assignedTo || "—"}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommonSensorsTable;
