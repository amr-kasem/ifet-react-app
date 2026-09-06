// import React from "react";

// const StaticPressureTableRow = ({
//   sequenceNumber,
//   pressure,
//   duration,
//   onInputChange,
//   isEditable,
//   finished,
//   loadingDirection,
//   isCustomRow = false,
//   trials = [],
//   onMarkFinishedClick, // <- add this
//   onViewTrialsClick,   // <- optional if you want to add trials modal later
// }) => {
//   return (
//     <tr>
//       <th className="table-dark">
//         <h5>{sequenceNumber}</h5>
//       </th>
//       <td>
//         <h6>{loadingDirection}</h6>
//       </td>
//       <td>
//         <input
//           type="number"
//           className="form-control text-center align-middle"
//           value={pressure}
//           onChange={(event) => onInputChange(event.target.value, "pressure")}
//           disabled={!isEditable}
//         />
//       </td>
//       <td>
//         <input
//           type="number"
//           className="form-control text-center align-middle"
//           value={duration}
//           onChange={(event) => onInputChange(event.target.value, "duration")}
//           disabled={!isEditable}
//         />
//       </td>
//       <td>
//         <h6>{finished?.toString()}</h6>
//       </td>
//       <td>
//         {trials.length > 0 && !finished && (
//           <button
//             className="btn btn-sm btn-outline-success"
//             onClick={onMarkFinishedClick}
//           >
//             Finish
//           </button>
//         )}
//       </td>
//       <td>
//         {trials.length > 0 && (
//           <button className="btn btn-sm btn-outline-info" onClick={onViewTrialsClick}>
//             Trials
//           </button>
//         )}
//       </td>
//     </tr>
//   );
// };

// export default StaticPressureTableRow;


import React from "react";
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


const StaticPressureTableRow = ({
  sequenceNumber,
  pressure,
  duration,
  onInputChange,
  isEditable,
  finished,
  loadingDirection,
  isCustomRow = false,
  trials = [],
  onMarkFinishedClick,
  onOpenMarkFinishedConfirm,
  onViewTrialsClick,
  onDeleteRow,
}) => {
  return (
    <tr>
      <th className="table-dark">
        <h5>{sequenceNumber}</h5>
      </th>
      <td><h6>{loadingDirection}</h6></td>
      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={pressure}
          onChange={(e) => onInputChange(e.target.value, "pressure")}
          disabled={!isEditable}
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control text-center align-middle"
          value={duration}
          onChange={(e) => onInputChange(e.target.value, "duration")}
          disabled={!isEditable}
        />
      </td>
      {/* <td><h6>{finished?.toString()}</h6></td> */}

      <td>
        {trials.length > 0 && !finished ? (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={onMarkFinishedClick}
          >
            Finish
          </button>
        ) : finished ? (
          <CheckCircleIcon style={{ color: "green" }} />
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
        ) : (
          <BlockIcon />
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
          <BlockIcon />
        )}
      </td>
    </tr>
  );
};

export default StaticPressureTableRow;
