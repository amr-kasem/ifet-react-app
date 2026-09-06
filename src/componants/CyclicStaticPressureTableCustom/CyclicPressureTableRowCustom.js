import React, { useEffect } from "react";

const CyclicPressureTableRowCustom = ({
  sequenceNumber,
  loadingDirection,
  airPressureCycles1,
  airPressureCycles2,
  numOfCycles,
  onInputChange,
  isEditable,
  finished,
}) => {

  return (
    <tr>
      <th className="table-dark">
        <h5>{sequenceNumber}</h5>
      </th>
      <td>{loadingDirection}</td>
      <td>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <input
            style={{ width: "100%" }}
            type="number"
            className="form-control text-center align-middle"
            value={airPressureCycles1}
            onChange={
              (event) =>
                onInputChange(
                  event.target.value,
                  `Sequance${sequenceNumber}AirPressureCycles1`
                )
              // onInputChange(event.target.value, `airPressureCycles1_${sequenceNumber}`)
            }
            disabled={!isEditable}
          />
          <span style={{ textWrap: "nowrap" }}>&nbsp;&nbsp;-P&nbsp;&nbsp;</span>
          <input
            style={{ width: "100%" }}
            type="number"
            className="form-control text-center align-middle"
            value={airPressureCycles2}
            onChange={
              (event) =>
                onInputChange(
                  event.target.value,
                  `Sequance${sequenceNumber}AirPressureCycles2`
                )
              // onInputChange(event.target.value, `airPressureCycles2_${sequenceNumber}`)
            }
            disabled={!isEditable}
          />
          <span>&nbsp;&nbsp;P</span>
        </div>
      </td>
      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={numOfCycles}
          onChange={(event) =>
            onInputChange(
              event.target.value,
              `Sequance${sequenceNumber}NumOfCycle`
            )
          }
          // onChange={(event) => onInputChange(event.target.value, `numOfCycles_${sequenceNumber}`)}
          disabled={!isEditable}
        />
      </td>
      {/* <td>
        <input
          type="checkbox"
          checked={toggleCheck}
          onChange={onToggleChange}
          disabled={toggleDisabled || status !== "idle"}
        />
      </td> */}
      <td>
        <h6>{finished.toString()}</h6>
      </td>
    </tr>
  );
};

export default CyclicPressureTableRowCustom;
