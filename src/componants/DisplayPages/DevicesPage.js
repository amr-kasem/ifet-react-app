import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DevicesPage.module.css";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://${window.location.hostname}:8000/devices/`
        );
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Transform devices data with statistics
  const deviceRows = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    
    return devices.map((device) => {
      const projects = device.projects || [];
      
      // Get unique parents
      const parents = [...new Set(projects.map(project => project.parent_id || "Legacy"))];
      
      // Calculate totals
      let totalProjects = projects.length;
      let totalStaticTests = 0;
      let totalCyclicTests = 0;
      let completedStaticTests = 0;
      let completedCyclicTests = 0;

      projects.forEach(project => {
        const staticTests = project.static_tests || [];
        const cyclicTests = project.cyclic_tests || [];
        
        totalStaticTests += staticTests.length;
        totalCyclicTests += cyclicTests.length;
        completedStaticTests += staticTests.filter(test => test.finished).length;
        completedCyclicTests += cyclicTests.filter(test => test.finished).length;
      });

      return {
        id: device.id,
        name: device.name,
        turboMode: device.turbo_mode,
        turboSlave: device.turbo_slave,
        totalProjects,
        totalParents: parents.length,
        parents,
        totalStaticTests,
        totalCyclicTests,
        completedStaticTests,
        completedCyclicTests,
        deviceData: device,
      };
    });
  }, [devices]);

  // Filter devices
  const filteredDevices = deviceRows.filter(
    (device) =>
      deviceFilter === "" ||
      device.name.toLowerCase().includes(deviceFilter.toLowerCase())
  );

  const handleDeviceClick = (device) => {
    navigate(`/devices/${encodeURIComponent(device.name)}/parents`, {
      state: {
        deviceName: device.name,
        deviceData: device.deviceData,
      },
    });
  };

  if (loading) return <div className={styles.container}>Loading devices...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate("/")}>
        Back
      </button>

      <h2 className={styles.heading}>Devices Overview</h2>

      {/* Filter Controls */}
      <div className={styles.filters}>
        <div>
          <label className={styles.filterLabel}>Device Name</label>
          <input
            type="text"
            className={styles.filterSelect}
            placeholder="Type to search devices..."
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Devices Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Total Projects</th>
              <th>Total Specimens</th>
              <th>Static Tests</th>
              <th>Cyclic Tests</th>
              <th>Completed Static</th>
              <th>Completed Cyclic</th>
              <th>Overall Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No matching devices found
                </td>
              </tr>
            ) : (
              filteredDevices.map((device, index) => {
                const totalTests = device.totalStaticTests + device.totalCyclicTests;
                const completedTests = device.completedStaticTests + device.completedCyclicTests;
                const progressPercentage = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;
                
                return (
                  <tr
                    key={index}
                    onClick={() => handleDeviceClick(device)}
                    style={{ cursor: "pointer" }}
                    className={styles.clickableRow}
                  >
                    <td>
                      <strong className={styles.deviceName}>{device.name}</strong>
                    </td>
                    <td>
                      <span className={styles.parentCount}>
                        {device.totalParents}
                      </span>
                    </td>
                    <td>
                      <span className={styles.projectCount}>
                        {device.totalProjects}
                      </span>
                    </td>
                    <td>
                      <span className={styles.testCount}>
                        {device.totalStaticTests}
                      </span>
                    </td>
                    <td>
                      <span className={styles.testCount}>
                        {device.totalCyclicTests}
                      </span>
                    </td>
                    <td>
                      <span className={styles.completedCount}>
                        {device.completedStaticTests}/{device.totalStaticTests}
                      </span>
                    </td>
                    <td>
                      <span className={styles.completedCount}>
                        {device.completedCyclicTests}/{device.totalCyclicTests}
                      </span>
                    </td>
                    <td>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>{progressPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statusContainer}>
                        {device.turboMode && (
                          <span className={styles.statusBadge}>Turbo</span>
                        )}
                        {device.turboSlave && (
                          <span className={styles.statusBadgeSlave}>Slave</span>
                        )}
                        {!device.turboMode && !device.turboSlave && (
                          <span className={styles.statusBadgeNormal}>Normal</span>
                        )}
                      </div>
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