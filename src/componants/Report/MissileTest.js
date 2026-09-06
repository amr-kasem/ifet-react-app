import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./Report.module.css";
import MissileModalForm from "./MissileModalForm";
import { addMissileTestRow } from "../../store/testsSlice";

const MissileTest = ({ projectData }) => {
  const [showModal, setShowModal] = useState(false);
  const tableData = useSelector((state) => state.tests.missileTest); // Retrieve table data from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMissileTestData();
  }, [projectData]);

  const fetchMissileTestData = async () => {
    console.log(
      "Fetching missile test data from projectData:",
      projectData.missile_impact_tests
    );
    dispatch({
      type: "tests/initializeMissileTest",
      payload: projectData.missile_impact_tests,
    });
  };

  const handleAddRow = () => {
    setShowModal(true);
  };

  const handleSaveRow = (newRow) => {
    console.log("Saving new missile test row:", newRow);
    dispatch(addMissileTestRow(newRow)); // Add the new row to the Redux store
    setShowModal(false);
  };

  const tableConfig = {
    header: ["Shot", "Area", "Velocity (ft/s)", "Results", "Notes"],
    title: "Missile Impact",
  };

  return (
    <div className={styles.reportContainer}>
      <h2>Missile Test</h2>
      <div className={styles.tableContainer}>
        <h3>{tableConfig.title}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              {tableConfig.header.map((column, colIndex) => (
                <th key={colIndex}>{column}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.id || rowIndex + 1}</td>{" "}
                {/* Use rowIndex as a fallback for row ID */}
                <td>{row.area}</td>
                <td>{row.velocity}</td>
                <td>{row.result ? "Pass" : "Fail"}</td>
                <td>{row.note}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={tableConfig.header.length}>Empty Row</td>
              <td>
                <button className={styles.addButton} onClick={handleAddRow}>
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {showModal && (
        <MissileModalForm
          columns={tableConfig.header}
          onSave={handleSaveRow}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MissileTest;
