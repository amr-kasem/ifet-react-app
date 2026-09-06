import React from "react";
import styles from "./ButtonWithChoices.module.css";

const ButtonWithChoices = ({
  choices = ["Option 1", "Option 2", "Option 3"],
  onSelect,
  selectedChoice,
  id,
  disabled,
}) => {

  const handleChange = (position) => {
    onSelect(choices[position === "left" ? 0 : position === "center" ? 1 : 2]);
  };

  return (
    // <div className={styles.mainContainer}>
    <div className={`${styles.mainContainer} ${disabled ? styles.disabled : ""}`}>
      <div
        className={styles.switch}
        style={{
          left:
            selectedChoice === choices[0]
              ? "3px"
              : selectedChoice === choices[1]
              ? "85px"
              : "167px",
          backgroundColor: selectedChoice === "Normal" ? "#EEE" : "#333", // Adjust color as needed
        }}
      />

      <input
        type="radio"
        id={`left-${id}`} // Unique IDs per instance
        name={`choice-${id}`} // Unique names per instance
        className={styles.radio}
        checked={selectedChoice === choices[0]}
        onChange={() => handleChange("left")}
      />
      <label
        htmlFor={`left-${id}`}
        className={styles.leftLabel}
        style={{
          color: selectedChoice === choices[0] ? "black" : "white",
          backgroundColor:
            selectedChoice === choices[0] ? "white" : "transparent",
        }}
      >
        <span>{choices[0]}</span>
      </label>

      <input
        type="radio"
        id={`center-${id}`} // Unique IDs per instance
        name={`choice-${id}`} // Unique names per instance
        className={styles.radio}
        checked={selectedChoice === choices[1]}
        onChange={() => handleChange("center")}
      />
      <label
        htmlFor={`center-${id}`}
        className={styles.centerLabel}
        style={{
          color: selectedChoice === choices[1] ? "black" : "white",
          backgroundColor:
            selectedChoice === choices[1] ? "white" : "transparent",
        }}
      >
        <span>{choices[1]}</span>
      </label>

      <input
        type="radio"
        id={`right-${id}`} // Unique IDs per instance
        name={`choice-${id}`} // Unique names per instance
        className={styles.radio}
        checked={selectedChoice === choices[2]}
        onChange={() => handleChange("right")}
      />
      <label
        htmlFor={`right-${id}`}
        className={styles.rightLabel}
        style={{
          color: selectedChoice === choices[2] ? "black" : "white",
          backgroundColor:
            selectedChoice === choices[2] ? "white" : "transparent",
        }}
      >
        <span>{choices[2]}</span>
      </label>
    </div>
  );
};

export default ButtonWithChoices;
