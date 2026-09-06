import React, { useEffect } from "react";

const StaticPressureTableRowCustom = ({
  sequenceNumber,
  pressure,
  duration,
  onInputChange,
  isEditable,
  finished,
  loadingDirection,
}) => {

  return (
    <tr>
      <th className="table-dark">
        <h5>{sequenceNumber}</h5>
      </th>
      <td>{loadingDirection}</td>
      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={pressure}
          onChange={(event) =>
            onInputChange(event.target.value, `Sequance${sequenceNumber}Pressure`)
          }
          disabled={!isEditable}
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={duration}
          onChange={(event) =>
            onInputChange(event.target.value, `Sequance${sequenceNumber}Duration`)
          }
          disabled={!isEditable}
        />
      </td>
      <td>
        <h6>{finished.toString()}</h6>
      </td>
    </tr>
  );
};

export default StaticPressureTableRowCustom;
