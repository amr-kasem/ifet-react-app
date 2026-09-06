import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Report.module.css';
import ModalForm from './MissileModalForm';

const StaticTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [tablesData, setTablesData] = useState([[], []]); // Two tables: Inward and Outward

  useEffect(() => {
    fetchStaticTestData();
  }, []);

  const fetchStaticTestData = async () => {
    try {
      // Fetch data for both Inward and Outward Static Pressure Test
      const inwardResponse = await axios.get(`http://${window.location.hostname}:8000/static/inward`);
      const outwardResponse = await axios.get(`http://${window.location.hostname}:8000/static/outward`);
      
      setTablesData([inwardResponse.data, outwardResponse.data]);
    } catch (error) {
      console.error("Error fetching Static Test data:", error);
    }
  };

  const handleAddRow = (tableIndex) => {
    setCurrentTable(tableIndex);
    setShowModal(true);
  };

  const handleSaveRow = async (newRow) => {
    try {
      const endpoint = currentTable === 0 
        ? `http://${window.location.hostname}:8000/static/inward` 
        : `http://${window.location.hostname}:8000/static/outward`;
        
      await axios.post(endpoint, JSON.stringify(newRow), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchStaticTestData();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new Static Test data:", error);
    }
  };

  const tableConfigs = [
    { header: ['Deflection Gauge', 'Max Deflection', 'Permanent Deflection', 'Recovery'], title: 'Static Pressure - Inward' },
    { header: ['Deflection Gauge', 'Max Deflection', 'Permanent Deflection', 'Recovery'], title: 'Static Pressure - Outward' }
  ];

  return (
    <div className={styles.reportContainer}>
      <h2>Static Test</h2>
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
                  <td>{row.deflection_gauge}</td>
                  <td>{row.max_deflection}</td>
                  <td>{row.permanent_deflection}</td>
                  <td>{row.recovery}</td>
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

export default StaticTest;
