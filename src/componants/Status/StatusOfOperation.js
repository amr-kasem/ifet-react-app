import React from "react";

const StatusOfOperation = ({ status }) => {
  return (
    <div className="d-flex">
      <h4 className="pt-1">Status: </h4>
      <div
        id="status"
        className="flex-grow-1 d-flex align-items-center"
        style={{
          backgroundColor: "darkorange",
          padding: "5px",
          borderRadius: "5px",
          fontSize: "20px",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {status}
      </div>
    </div>
  );
};

export default StatusOfOperation;
