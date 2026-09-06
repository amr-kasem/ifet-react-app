import React from "react";
import styles from "./InfoModal.module.css";  // Assuming you have a similar styles file

const InfoModal = ({
  visible,
  title = "Information",
  message = "This is an informational message.",
  okText = "OK",
  onOk,
}) => {
  if (!visible) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.okButton} onClick={onOk}>
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
