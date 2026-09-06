// src/componants/DisplayPages/TestTypeSelectionPage.js
import React from "react";
import styles from "./TestTypeSelectionPage.module.css"; // Use this new CSS file
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function TestTypeSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectName } = useParams();

  // const { projectData, deviceName } = location.state || {};
  const { projectData, deviceName, parentName } = location.state || {};

  const handleSelect = (type) => {
    // Pass all necessary state to TestsPage
    navigate(`/projects/${encodeURIComponent(projectName)}/tests`, {
      state: {
        projectData,
        deviceName,
        projectName,
        parentName,
        categoryFilter: type,
      },
    });
  };

  return (
    <div className={styles.container}>
      <button className={styles.buttonnn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h2 className={styles.heading}>Choose Test's Type</h2>
      <div className={styles.buttonGrid}>
        <button
          className={styles.button}
          onClick={() => handleSelect("static")}
        >
          Static
        </button>
        <button
          className={styles.button}
          onClick={() => handleSelect("cyclic")}
        >
          Cyclic
        </button>
        <button className={styles.button} disabled>
          Type 3
        </button>
        <button className={styles.button} disabled>
          Type 4
        </button>
      </div>
    </div>
  );
}
