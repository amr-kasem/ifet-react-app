import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./TrialsPage.module.css";

export default function TrialsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName, testId } = useParams();

  const { trialsData, testInfo, deviceName } = location.state || {};

  // Handle trial click to navigate to deflections page
  const handleTrialClick = (trial) => {
    navigate(
      `/projects/${encodeURIComponent(projectName)}/tests/${testId}/trials/${
        trial.id
      }/deflections`,
      {
        state: {
          deflectionsData: trial.deflections,
          trialInfo: trial,
          testInfo,
          projectName,
          deviceName,
        },
      }
    );
  };

  if (!trialsData || trialsData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <button
            onClick={() => navigate("/display")}
            className={styles.breadcrumbLink}
          >
            Projects
          </button>
          <span> / </span>
          <button
            onClick={() =>
              navigate(`/projects/${encodeURIComponent(projectName)}/tests`, {
                state: { projectName, deviceName },
              })
            }
            className={styles.breadcrumbLink}
          >
            {projectName}
          </button>
          <span> / Test {testId}</span>
        </div>

        <h2 className={styles.heading}>Trials for Test {testId}</h2>
        <p>No trials data available for this test.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate(-1)}>Back</button>

      <h2 className={styles.heading}>Trials for Test {testId}</h2>
      {/* Trials Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Trial ID</th>
              <th>Trial Number</th>
              <th>Num of Deflections</th>
            </tr>
          </thead>
          <tbody>
            {trialsData.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.noData}>
                  No trials found
                </td>
              </tr>
            ) : (
              trialsData.map((trial, index) => {
                const hasDeflections =
                  trial.deflections && trial.deflections.length > 0;
                const deflectionCount = trial.deflections
                  ? trial.deflections.length
                  : 0;

                return (
                  <tr
                    key={index}
                    onClick={
                      hasDeflections ? () => handleTrialClick(trial) : undefined
                    }
                    style={{
                      cursor: hasDeflections ? "pointer" : "default",
                      opacity: hasDeflections ? 1 : 0.6,
                    }}
                    className={
                      hasDeflections ? styles.clickableRow : styles.disabledRow
                    }
                  >
                    <td>
                      <strong className={styles.trialId}>{trial.id}</strong>
                    </td>
                    <td>{trial.trial_number}</td>
                    <td>
                      <span
                        className={
                          deflectionCount > 0
                            ? styles.deflectionCount
                            : styles.noDeflections
                        }
                      >
                        {deflectionCount}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
