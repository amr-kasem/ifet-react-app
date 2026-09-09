import React from "react";
import styles from "./StatusPanel.module.css";

// The label sits above the value rather than beside it, so a long state string
// gets the full width of the column instead of squeezing against the heading.
// `id="status"` is kept - it is addressed from outside this component.
const StatusOfOperation = ({ status }) => {
  return (
    <div className={styles.statusBlock}>
      <h4>Status</h4>
      <div id="status" className={styles.statusValue} title={status}>
        {status}
      </div>
    </div>
  );
};

export default StatusOfOperation;
