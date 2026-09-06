import React from "react";

const Sensors = ({ deviceData, toggleBtn }) => {
  const getSensorsColumns = () => {
    const sensorsList = Object.entries(deviceData.sensors).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    const filteredSensors = sensorsList.filter(
      (sensor) =>
        toggleBtn === "static_load" ||
        (sensor.role === "pressure" && toggleBtn === "dynamic_load")
    );

    return filteredSensors.map((sensor) => (
      <th key={sensor.id} scope="col">
        {sensor.name.replace("sensor", "")}
      </th>
    ));
  };

  const getSensorsData = () => {
    const sensorsList = Object.entries(deviceData.sensors).map(
      ([key, value]) => ({
        ...value,
        id: key, // Add an 'id' field to preserve the original key
      })
    );

    const filteredSensors = sensorsList.filter(
      (sensor) =>
        toggleBtn === "static_load" ||
        (sensor.role === "pressure" && toggleBtn === "dynamic_load")
    );

    return filteredSensors.map((sensor) => (
      <td key={sensor.id}>{parseFloat(sensor.value).toFixed(3)}</td>
    ));
  };

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
