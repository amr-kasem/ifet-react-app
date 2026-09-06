import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Report.module.css';
import ModalForm from './MissileModalForm';

const InfiltrationTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [tablesData, setTablesData] = useState([[], []]); // Two tables: Air and Water

  useEffect(() => {
    fetchInfiltrationTestData();
  }, []);

  const fetchInfiltrationTestData = async () => {
    try {
      // Fetch data for both Air and Water Infiltration
      const airResponse = await axios.get(`http://${window.location.hostname}:8000/infiltration/air`);
      const waterResponse = await axios.get(`http://${window.location.hostname}:8000/infiltration/water`);
      
      setTablesData([airResponse.data, waterResponse.data]);
    } catch (error) {
      console.error("Error fetching Infiltration Test data:", error);
    }
  };

  const handleAddRow = (tableIndex) => {
    setCurrentTable(tableIndex);
    setShowModal(true);
  };

  const handleSaveRow = async (newRow) => {
    try {
      const endpoint = currentTable === 0 
        ? `http://${window.location.hostname}:8000/infiltration/air` 
        : `http://${window.location.hostname}:8000/infiltration/water`;
        
      await axios.post(endpoint, JSON.stringify(newRow), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchInfiltrationTestData();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new Infiltration Test data:", error);
    }
  };

  const tableConfigs = [
    { header: ['Test Pressure (psf)', 'Measured Flow (cfm/ft^2)', 'Allowed Flow (cfm/ft^2)'], title: 'Air Infiltration' },
    { header: ['Test Pressure (psf)', 'Test Duration (min.)', 'Water Leakage (in^3/s)'], title: 'Water Infiltration' }
  ];

  return (
    <div className={styles.reportContainer}>
      <h2>Infiltration Test</h2>
      {tableConfigs.map((config, index) => (
        <div key={index} className={styles.tableContainer}>
          <h3>{config.title}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                {config.header.map((column, colIndex) => (
                  <th key={colIndex}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tablesData[index].map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {config.header.map((column, colIndex) => (
                    <td key={colIndex}>{row[column.toLowerCase().replace(/ /g, '_')]}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={config.header.length}>Empty Row</td>
                <td>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddRow(index)}
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {showModal && (
        <ModalForm
          columns={tableConfigs[currentTable].header}
          onSave={handleSaveRow}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default InfiltrationTest;
