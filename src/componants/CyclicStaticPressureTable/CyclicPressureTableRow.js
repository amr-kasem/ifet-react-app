import React from "react";
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const CyclicPressureTableRow = ({
  sequenceNumber,
  loadingDirection,
  airPressureCycles1,
  airPressureCycles2,
  numOfCycles,
  onInputChange,
  isEditable,
  finished,
  trials,
  isCustomRow,
  onMarkFinishedClick,
  onOpenMarkFinishedConfirm,
  onViewTrialsClick,
  onDeleteRow, // ✅ new prop
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
            onChange={(e) => onInputChange(e.target.value, "high_pressure")}
            disabled={!isEditable}
          />
          <span style={{ whiteSpace: "nowrap" }}>&nbsp;-P&nbsp;</span>
          <input
            style={{ width: "100%" }}
            type="number"
            className="form-control text-center align-middle"
            value={airPressureCycles2}
            onChange={(e) => onInputChange(e.target.value, "low_pressure")}
            disabled={!isEditable}
          />
          <span>&nbsp;P</span>
        </div>
      </td>

      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={numOfCycles}
          onChange={(e) => onInputChange(e.target.value, "cycles")}
          disabled={!isEditable}
        />
      </td>

      {/* <td>
        <h6>{finished?.toString()}</h6>
      </td> */}

      <td>
        {trials.length > 0 && !finished ? (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={onMarkFinishedClick}
          >
            Finish
          </button>
        ) : finished ? (
          <CheckCircleIcon  style={{color:"green"}}/>
        ) : (
          <button
            type="button"
            className="btn btn-link p-0 border-0 align-middle"
            onClick={onOpenMarkFinishedConfirm}
            title="Mark as finished"
            aria-label="Mark test as finished"
          >
            <CancelIcon style={{ color: "red" }} />
          </button>
        )}
      </td>
      <td>
        {trials.length > 0 ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={onViewTrialsClick}
          >
            Trials
          </button>
        ): (
          <BlockIcon  />
        )}
      </td>
      <td>
        {isCustomRow && !finished ? (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={onDeleteRow}
          >
            Delete
          </button>
        ) : (
          <BlockIcon  />
        )}
      </td>
    </tr>
  );
};

export default CyclicPressureTableRow;
