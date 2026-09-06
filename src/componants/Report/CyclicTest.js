import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Report.module.css';
import CyclicModalForm from './CyclicModalForm';

const CyclicTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [tablesData, setTablesData] = useState([[], []]); // Two tables: Inward and Outward

  useEffect(() => {
    fetchCyclicTestData();
  }, []);

  const fetchCyclicTestData = async () => {
    try {
      // Fetch data for both Inward and Outward Cyclic Pressure Test
      const inwardResponse = await axios.get(`http://${window.location.hostname}:8000/cyclic/inward`);
      const outwardResponse = await axios.get(`http://${window.location.hostname}:8000/cyclic/outward`);
      
      setTablesData([inwardResponse.data, outwardResponse.data]);
    } catch (error) {
      console.error("Error fetching Cyclic Test data:", error);
    }
  };

  const handleAddRow = (tableIndex) => {
    setCurrentTable(tableIndex);
    setShowModal(true);
  };

  const handleSaveRow = async (newRow) => {
    try {
      const endpoint = currentTable === 0 
        ? `http://${window.location.hostname}:8000/cyclic/inward` 
        : `http://${window.location.hostname}:8000/cyclic/outward`;
        
      await axios.post(endpoint, JSON.stringify(newRow), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchCyclicTestData();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new Cyclic Test data:", error);
    }
  };

  const tableConfigs = [
    { header: ['Cycles', 'Pressure Range (PSF)', 'Deflection (in)', 'Permanent Set (in)', 'Results', 'Notes'], title: 'Cyclic Pressure Test - Inward' },
    { header: ['Cycles', 'Pressure Range (PSF)', 'Deflection (in)', 'Permanent Set (in)', 'Results', 'Notes'], title: 'Cyclic Pressure Test - Outward' }
  ];

  return (
    <div className={styles.reportContainer}>
      <h2>Cyclic Test</h2>
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
                  <td>{row.cycles}</td>
                  <td>{row.pressure_range}</td>
                  <td>{row.deflection}</td>
                  <td>{row.permanent_set}</td>
                  <td>{row.result ? 'Pass' : 'Fail'}</td>
                  <td>{row.note}</td>
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
        <CyclicModalForm
          columns={tableConfigs[currentTable].header}
          onSave={handleSaveRow}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CyclicTest;
