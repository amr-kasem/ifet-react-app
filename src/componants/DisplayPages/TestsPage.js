import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TestsPage.module.css";

export default function TestsPage() {
  const location = useLocation();
  const {
    projectData,
    deviceName,
    projectName,
    parentName,
    categoryFilter: initialCategory,
  } = location.state || {};

  const [categoryFilter, setCategoryFilter] = useState(initialCategory || "");
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = useMemo(() => {
    if (categoryFilter === "static") {
      return [
        { key: "testId", label: "Test ID" },
        { key: "category", label: "Category" },
        { key: "type", label: "Type" },
        { key: "pressure", label: "Pressure" },
        { key: "duration", label: "Duration" },
        { key: "finished", label: "Finished" },
        { key: "trials", label: "Num of trials" },
      ];
    } else if (categoryFilter === "cyclic") {
      return [
        { key: "testId", label: "Test ID" },
        { key: "category", label: "Category" },
        { key: "type", label: "Type" },
        { key: "cycles", label: "Cycles" },
        { key: "low_pressure", label: "Low Pressure" },
        { key: "high_pressure", label: "High Pressure" },
        { key: "finished", label: "Finished" },
        { key: "trials", label: "Num of trials" },
      ];
    } else {
      // Default: show all columns
      return [
        { key: "testId", label: "Test ID" },
        { key: "category", label: "Category" },
        { key: "type", label: "Type" },
        { key: "pressure", label: "Pressure" },
        { key: "duration", label: "Duration" },
        { key: "cycles", label: "Cycles" },
        { key: "low_pressure", label: "Low Pressure" },
        { key: "high_pressure", label: "High Pressure" },
        { key: "finished", label: "Finished" },
        { key: "trials", label: "Num of trials" },
      ];
    }
  }, [categoryFilter]);

  // Transform project data to test rows
  const testRows = useMemo(() => {
    if (!projectData) return [];
    const result = [];

    // Add static tests
    (projectData.static_tests || []).forEach((test) => {
      result.push({
        testId: test.id,
        category: "static",
        type: test.type,
        pressure: test.pressure,
        duration: test.duration,
        cycles: "",
        low_pressure: "",
        high_pressure: "",
        current_cycle: "",
        resume: "",
        finished: test.finished ? "Yes" : "No",
        trials: test.trials ? test.trials.length : 0,
        trialsData: test.trials || [],
        preset: test.preset ? "Yes" : "No",
      });
    });

    // Add cyclic tests
    (projectData.cyclic_tests || []).forEach((test) => {
      result.push({
        testId: test.index,
        category: "cyclic",
        type: test.type,
        pressure: "",
        duration: "",
        cycles: test.cycles,
        low_pressure: test.low_pressure,
        high_pressure: test.high_pressure,
        current_cycle: test.current_cycle,
        resume: test.resume ? "Yes" : "No",
        finished: test.finished ? "Yes" : "No",
        trials: test.trials ? test.trials.length : 0,
        trialsData: test.trials || [],
        preset: test.preset ? "Yes" : "No",
      });
    });

    return result;
  }, [projectData]);

  // Filter tests
const filteredTests = testRows
  .filter((test) => test.category === categoryFilter)
  .filter((test) => test.preset === "Yes")
  .filter((test) => typeFilter === "" || test.type === typeFilter)
  .filter((test) =>
    statusFilter === "" ||
    (statusFilter === "completed" && test.finished === "Yes") ||
    (statusFilter === "pending" && test.finished === "No")
  );

  // Get unique values for filters
  const testTypes = [...new Set(testRows.map((t) => t.type))];

  const handleTestClick = (test) => {
    // Only navigate if test has trials
    if (test.trials > 0) {
      navigate(
        `/projects/${encodeURIComponent(projectName)}/tests/${
          test.testId
        }/trials`,
        {
          state: {
            trialsData: test.trialsData,
            testInfo: test,
            projectName,
            deviceName,
            parentName,
          },
        }
      );
    }
  };

  if (!projectData) {
    return (
      <div className={styles.container}>
        <p>
          No project data available. Please navigate from the projects page.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate(-1)}>
        Back
      </button>

      <h2 className={styles.heading}>Tests for {projectName}</h2>

      {/* Filter Controls */}
      <div className={styles.filters}>
        <div>
          <label className={styles.filterLabel}>Type</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {testTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.filterLabel}>Status</label>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.noData}>
                  No matching tests found
                </td>
              </tr>
            ) : (
              filteredTests.map((test, index) => (
                <tr
                  key={index}
                  onClick={() => handleTestClick(test)}
                  style={{
                    cursor: test.trials > 0 ? "pointer" : "not-allowed",
                    opacity: test.trials > 0 ? 1 : 0.6,
                  }}
                  className={
                    test.trials > 0 ? styles.clickableRow : styles.disabledRow
                  }
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === "trials" ? (
                        <span
                          className={
                            test.trials > 0
                              ? styles.trialsCount
                              : styles.noTrials
                          }
                        >
                          {test.trials}
                        </span>
                      ) : (
                        <span
                          className={
                            col.key === "category" || col.key === "type"
                              ? "capitalize"
                              : ""
                          }
                        >
                          {test[col.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
