import React from "react";

const Sensors = ({ deviceData, toggleBtn }) => {
  const sensors = Object.entries(deviceData.sensors)
    .map(([key, value]) => ({
      ...value,
      id: key, // Add an 'id' field to preserve the original key
    }))
    .filter(
      (sensor) =>
        toggleBtn === "static_load" ||
        (sensor.role === "pressure" && toggleBtn === "dynamic_load")
    );

  // Impact reads no sensors - it never touches the rig - so the filter above
  // yields nothing and what was left was a "Sensors" heading over an empty
  // table. Nothing to show means nothing to render, heading included.
  if (sensors.length === 0) return null;

  const getSensorsColumns = () =>
    sensors.map((sensor) => (
      <th key={sensor.id} scope="col">
        {sensor.name.replace("sensor", "")}
      </th>
    ));

  const getSensorsData = () =>
    sensors.map((sensor) => (
      <td key={sensor.id}>{parseFloat(sensor.value).toFixed(3)}</td>
    ));

  return (
    <div className="row mt-4">
      <h4>Sensors</h4>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sensors;
