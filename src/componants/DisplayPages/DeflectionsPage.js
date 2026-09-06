import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./DeflectionsPage.module.css";

export default function DeflectionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName, testId, trialId } = useParams();

  // const { deflectionsData, trialInfo, testInfo, deviceName } =
  const { deflectionsData, trialInfo, testInfo, deviceName, parentName } =
    location.state || {};

  if (!deflectionsData || deflectionsData.length === 0) {
    return (
      <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate(-1)}>Back</button>
        <h2 className={styles.heading}>Deflections for Trial {trialId}</h2>
        <p>No deflection data available for this trial.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate(-1)}>Back</button>
      

      <h2 className={styles.heading}>Deflections for Trial {trialId}</h2>

      {/* Deflections Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gauge ID</th>
              <th>Max Deflection</th>
              <th>Permanent Deflection</th>
              <th>Recovery</th>
            </tr>
          </thead>
          <tbody>
            {deflectionsData.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.noData}>
                  No deflections found
                </td>
              </tr>
            ) : (
              deflectionsData.map((deflection, index) => (
                <tr key={index}>
                  <td>
                    <strong>{deflection.deflection_gauge}</strong>
                  </td>
                  <td>{deflection.max_deflection}</td>
                  <td>{deflection.permanent_deflection}</td>
                  <td>{deflection.recovery}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
