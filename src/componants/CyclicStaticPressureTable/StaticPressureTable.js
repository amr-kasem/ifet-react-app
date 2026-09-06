import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { devicesActions } from "../../store/sensors-slice";
import StaticPressureTableRow from "./StaticPressureTableRow";
import styles from "./StaticPressureTable.module.css";
import AddRowStaticPressureLoadingModal from "../Modals/AddRowStaticPressureLoadingModal";
import TrialsModal from "../Modals/TrialsModal";
import ConfirmationModal from "../Modals/ConfirmationModal";

const StaticPressureTable = (props) => {
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find(
    (device) => device.deviceID === props.neededDevice.deviceID
  );

  const [showTrialsModal, setShowTrialsModal] = useState(false);
  const [selectedTrials, setSelectedTrials] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(null);

  // Initialize presetRows with 6 rows if empty
  const initialPresetRows = Array.from({ length: 6 }, (_, i) => ({
    index: i,
    pressure: 0,
    duration: 0,
    type: i < 3 ? "inward" : "outward",
    finished: false,
    preset: true,
  }));

  const [presetRows, setPresetRows] = useState(
    neededDevice.presetStaticRows?.length === 6
      ? neededDevice.presetStaticRows
      : initialPresetRows
  );
  const [customRows, setCustomRows] = useState(
    neededDevice.customStaticRows || []
  );
  const dispatch = useDispatch();
  const status = props.neededDevice.status;

  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState({
    pressure_factor: "Structural Pressure",
    pressure: 0,
    index: 0,
    duration: 0,
    type: "inward",
    id: 0,
    deflections: [],
    finished: false,
  });
  const isValid =
    newRowData.pressure !== "" &&
    !isNaN(newRowData.pressure) &&
    newRowData.duration !== "" &&
    !isNaN(newRowData.duration);

  // Always sync with Redux store data when it changes
  useEffect(() => {
    // Always sync presetRows with Redux store
    if (neededDevice.presetStaticRows && neededDevice.presetStaticRows.length > 0) {
      console.log("StaticPressureTable: Updating presetRows from Redux store:", neededDevice.presetStaticRows);
      setPresetRows(neededDevice.presetStaticRows);
    } else {
      // Initialize with default rows if no data available
      setPresetRows(initialPresetRows);
    }

    // Always sync customRows with Redux store
    if (neededDevice.customStaticRows) {
      console.log("StaticPressureTable: Updating customRows from Redux store:", neededDevice.customStaticRows);
      setCustomRows(neededDevice.customStaticRows);
    } else {
      setCustomRows([]);
    }
  }, [
    neededDevice.presetStaticRows,
    neededDevice.customStaticRows,
    props.neededDevice.deviceID,
  ]);

  // Set initial page status
  useEffect(() => {
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.neededDevice.deviceID,
        current_index: 0,
      })
    );
  }, [dispatch, props.neededDevice.deviceID]);

  // Update Redux with row changes
  useEffect(() => {
    const allRowsStatus = {};
    presetRows.forEach((row, index) => {
      allRowsStatus[`static_index_${index + 1}_pressure`] = row.pressure;
      allRowsStatus[`static_index_${index + 1}_duration`] = row.duration;
      allRowsStatus[`static_index_${index + 1}_finished`] = row.finished;
    });

    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.neededDevice.deviceID,
        ...allRowsStatus,
      })
    );
  }, [presetRows, customRows, props.neededDevice.deviceID, dispatch]);

  const handleInputChange = (index, value, fieldName) => {
    const updatedRows = presetRows.map((row, i) =>
      i === index ? { ...row, [fieldName]: Number(value) } : row
    );
    setPresetRows(updatedRows);
    dispatch(
      devicesActions.setPresetStaticRows({
        deviceID: props.neededDevice.deviceID,
        rows: updatedRows,
      })
    );
  };

  const handleCustomInputChange = (index, value, fieldName) => {
    const updatedRows = customRows.map((row, i) =>
      i === index ? { ...row, [fieldName]: Number(value) } : row
    );
    setCustomRows(updatedRows);
    dispatch(
      devicesActions.setCustomStaticRows({
        deviceID: props.neededDevice.deviceID,
        rows: updatedRows,
      })
    );
  };

  const handleSaveEditClick = () => {
    if (props.isEditable) {
      try {
        // Format the data exactly as expected by the API
        const allRowsForAPI = [
          ...presetRows.map((row) => ({
            index: row.index,
            duration: Number(row.duration),
            pressure: Number(row.pressure),
            type: row.type,
            preset: true,
            // Include any additional fields that might be required
            // by your API (this was likely missing)
            ...(row.id && { id: row.id }),
            ...(row.finished !== undefined && { finished: row.finished }),
          })),
          ...customRows.map((row) => ({
            index: row.index,
            duration: Number(row.duration),
            pressure: Number(row.pressure),
            type: row.type,
            preset: false,
            // Include any additional fields that might be required
            // by your API
            ...(row.id && { id: row.id }),
            ...(row.finished !== undefined && { finished: row.finished }),
          })),
        ];

        console.log("allRowsForAPI:", allRowsForAPI);

        // First check if API endpoint is correct, should it be static_tests or static-tests?
        axios
          .put(
            `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests`,
            allRowsForAPI,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log("All static tests updated successfully", response.data);

            // Check if response contains the expected data structure
            if (response.data && response.data.static_tests) {
              const updatedStaticTests = response.data.static_tests;

              const presetRowsToSave = updatedStaticTests
                .filter((row) => row.preset)
                .sort((a, b) => a.index - b.index);

              const customRowsToSave = updatedStaticTests
                .filter((row) => !row.preset)
                .sort((a, b) => a.index - b.index);

              dispatch(
                devicesActions.setPresetStaticRows({
                  deviceID: props.neededDevice.deviceID,
                  rows: presetRowsToSave,
                })
              );
              dispatch(
                devicesActions.setCustomStaticRows({
                  deviceID: props.neededDevice.deviceID,
                  rows: customRowsToSave,
                })
              );

              setPresetRows(presetRowsToSave);
              setCustomRows(customRowsToSave);
            } else {
              console.warn("Unexpected API response format:", response.data);
              // Use current state if response format is unexpected
              dispatch(
                devicesActions.setPresetStaticRows({
                  deviceID: props.neededDevice.deviceID,
                  rows: presetRows,
                })
              );
              dispatch(
                devicesActions.setCustomStaticRows({
                  deviceID: props.neededDevice.deviceID,
                  rows: customRows,
                })
              );
            }

            props.setIsEditable(false);
          })
          .catch((error) => {
            console.error(
              "Error saving data:",
              error.response?.data || error.message
            );

            // Show a more user-friendly error if needed
            alert(
              "Error saving changes. Please try again or contact support if the issue persists."
            );
          });
      } catch (error) {
        console.error("Exception during save operation:", error);
      }
    } else {
      props.setIsEditable(true);
    }
  };

  const handleViewTrials = (trials) => {
    setSelectedTrials(trials);
    setShowTrialsModal(true);
  };

  const closeFinishModal = () => {
    setShowFinishModal(false);
    setPendingFinish(null);
  };

  const confirmMarkFinishedFromModal = (finishTarget) => {
    const target = finishTarget ?? pendingFinish;
    if (!target) return;
    const { mode, i, apiIndex } = target;
    axios
      .put(
        `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests/${apiIndex}/finish`
      )
      .then((res) => {
        const updatedRow = res.data;
        if (mode === "preset") {
          const updated = [...presetRows];
          updated[i] = updatedRow;
          setPresetRows(updated);
          dispatch(
            devicesActions.setPresetStaticRows({
              deviceID: props.neededDevice.deviceID,
              rows: updated,
            })
          );
        } else {
          const updated = [...customRows];
          updated[i] = updatedRow;
          setCustomRows(updated);
          dispatch(
            devicesActions.setCustomStaticRows({
              deviceID: props.neededDevice.deviceID,
              rows: updated,
            })
          );
        }
        closeFinishModal();
      })
      .catch((err) => {
        console.error(
          "Error marking test as finished:",
          err.response?.data || err.message
        );
      });
  };

  const handleDeleteRow = (row) => {
    setRowToDelete(row);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!rowToDelete) return;
    console.log("rowToDelete", rowToDelete);

    axios
      .delete(
        `http://${window.location.hostname}:8000/projects/${props.projectID}/static-tests/${rowToDelete.index}/`
      )
      .then((response) => {
        // console.log(response.body)
        // Filter by unique identifier (index) not by array position
        const updated = customRows.filter(
          (row) => row.index !== rowToDelete.index
        );

        setCustomRows(updated);
        dispatch(
          devicesActions.setCustomStaticRows({
            deviceID: props.neededDevice.deviceID,
            rows: updated,
          })
        );

        setRowToDelete(null);
        setShowDeleteModal(false);
      })
      .catch((err) => {
        // Capture the error message
        const errorMessage = err.response?.data?.detail || "An error occurred.";
        setErrorMessage(errorMessage); // Set error message state
        console.error("Delete error:", err);
      });
  };

  return (
    <>
      <TrialsModal
        visible={showTrialsModal}
        onClose={() => setShowTrialsModal(false)}
        trials={selectedTrials}
      />

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Row"
        message={errorMessage || "Are you sure you want to delete this custom static test row?"}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setShowDeleteModal(false);
          setRowToDelete(null);
          setErrorMessage(""); // Clear the error message when modal is closed
        }}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmationModal
        visible={showFinishModal}
        title="Test Status"
        message="Is the test finished?"
        confirmText="Yes"
        cancelText="No"
        onCancel={closeFinishModal}
        onConfirm={() => {
          const target = pendingFinish;
          closeFinishModal();
          confirmMarkFinishedFromModal(target);
        }}
      />

      {showAddRowModal && (
        <AddRowStaticPressureLoadingModal
          newRowData={newRowData}
          setNewRowData={setNewRowData}
          isValid={isValid}
          onCancel={() => setShowAddRowModal(false)}
          onSave={() => {
            // Calculate the next available index
            const maxIndex =
              Math.max(
                ...presetRows.map((row) => row.index),
                ...customRows.map((row) => row.index),
                -1
              ) + 1;

            const rowToSend = {
              index: maxIndex,
              pressure: Number(newRowData.pressure),
              duration: Number(newRowData.duration),
              type: newRowData.type,
              preset: false,
            };

            axios
              .post(
                `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests/`,
                rowToSend,
                {
                  headers: { "Content-Type": "application/json" },
                }
              )
              .then((response) => {
                const createdRow = {
                  ...newRowData,
                  ...response.data,
                  index: maxIndex,
                  pressure: Number(newRowData.pressure),
                  duration: Number(newRowData.duration),
                  finished: false,
                  preset: false,
                };

                const updatedCustomRows = [...customRows, createdRow];
                dispatch(
                  devicesActions.setCustomStaticRows({
                    deviceID: props.neededDevice.deviceID,
                    rows: updatedCustomRows,
                  })
                );
                setCustomRows(updatedCustomRows);
                setShowAddRowModal(false);

                setNewRowData({
                  pressure_factor: "Structural Pressure",
                  pressure: 0,
                  index: 0,
                  duration: 0,
                  type: "inward",
                  id: 0,
                  deflections: [],
                  finished: false,
                });
              })
              .catch((error) => {
                console.error(
                  "Failed to create custom static test row:",
                  error.response?.data || error.message
                );
              });
          }}
        />
      )}

      <div className="row">
        <div className="col-6 col-md-5 col-lg-4 mt-3">
          <h4>{props.type} Pressure Loading</h4>
        </div>

        <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
          <button
            type="button"
            className={`btn btn-lg me-2 ${
              props.isEditable ? "btn-danger" : "btn-primary"
            }`}
            disabled={status !== "idle"}
            id="NewPr"
            onClick={handleSaveEditClick}
          >
            {props.isEditable ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="row">
            <div className="table-responsive">
              <table
                className="table text-center table-bordered align-middle"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "87px" }}>
                      <h6>Loading Sequence</h6>
                    </th>
                    <th style={{ width: "82px" }}>
                      <h6>Loading Direction</h6>
                    </th>
                    <th style={{ width: "250px" }}>
                      <h6>Pressure</h6>
                    </th>
                    <th style={{ width: "79px" }}>
                      <h6>Holding Time</h6>
                    </th>
                    {/* <th style={{ width: "61px" }}>
                      <h6>Finished</h6>
                    </th> */}

                    <th style={{ width: "61px" }}>
                      <h6>Mark as finished</h6>
                    </th>
                    <th style={{ width: "61px" }}>
                      <h6>Trials</h6>
                    </th>
                    <th style={{ width: "61px" }}>
                      <h6>Delete</h6>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-secondary">
                    <td colSpan="7">
                      <strong>Preset Loading Sequences</strong>
                    </td>
                  </tr>

                  {presetRows.map((row, index) => (
                    <StaticPressureTableRow
                      key={`preset-row-${row.index}-${index}`}
                      sequenceNumber={index + 1}
                      loadingDirection={row.type}
                      pressure={row.pressure}
                      duration={row.duration}
                      onInputChange={(value, field) =>
                        handleInputChange(index, value, field)
                      }
                      isEditable={props.isEditable}
                      status={status}
                      finished={row.finished}
                      isCustomRow={false}
                      trials={row.trials || []}
                      onMarkFinishedClick={() => {
                        axios
                          .put(
                            `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests/${row.index}/finish`
                          )
                          .then((res) => {
                            const updatedRow = res.data;
                            const updated = [...presetRows];
                            updated[index] = updatedRow;

                            setPresetRows(updated);
                            dispatch(
                              devicesActions.setPresetStaticRows({
                                deviceID: props.neededDevice.deviceID,
                                rows: updated,
                              })
                            );
                          })
                          .catch((err) => {
                            console.error(
                              "Error marking test as finished:",
                              err.response?.data || err.message
                            );
                          });
                      }}
                      onOpenMarkFinishedConfirm={() => {
                        setPendingFinish({
                          mode: "preset",
                          i: index,
                          apiIndex: row.index,
                        });
                        setShowFinishModal(true);
                      }}
                      onViewTrialsClick={() =>
                        handleViewTrials(row.trials || [])
                      }
                    />
                  ))}

                  {customRows.length > 0 && (
                    <tr className="table-secondary">
                      <td colSpan="7">
                        <strong>Custom Loading Sequences</strong>
                      </td>
                    </tr>
                  )}

                  {customRows.map((row, index) => (
                    <StaticPressureTableRow
                      key={`custom-row-${row.index}-${index}`}
                      sequenceNumber={presetRows.length + index + 1}
                      loadingDirection={row.type}
                      pressure={row.pressure}
                      duration={row.duration}
                      onInputChange={(value, field) =>
                        handleCustomInputChange(index, value, field)
                      }
                      isEditable={props.isEditable}
                      status={status}
                      finished={row.finished}
                      isCustomRow={true}
                      trials={row.trials || []}
                      onMarkFinishedClick={() => {
                        axios
                          .put(
                            `http://${window.location.hostname}:8000/projects/${props.projectID}/static_tests/${row.index}/finish`
                          )
                          .then((res) => {
                            const updatedRow = res.data;
                            const updated = [...customRows];
                            updated[index] = updatedRow;

                            setCustomRows(updated);
                            dispatch(
                              devicesActions.setCustomStaticRows({
                                deviceID: props.neededDevice.deviceID,
                                rows: updated,
                              })
                            );
                          })
                          .catch((err) => {
                            console.error(
                              "Error marking custom test as finished:",
                              err.response?.data || err.message
                            );
                          });
                      }}
                      onOpenMarkFinishedConfirm={() => {
                        setPendingFinish({
                          mode: "custom",
                          i: index,
                          apiIndex: row.index,
                        });
                        setShowFinishModal(true);
                      }}
                      onViewTrialsClick={() =>
                        handleViewTrials(row.trials || [])
                      }
                      onDeleteRow={() => handleDeleteRow(row)}
                    />
                  ))}

                  <tr>
                    <td colSpan="7">
                      <button
                        type="button"
                        className="btn btn-success me-2"
                        disabled={status !== "idle"}
                        onClick={() => setShowAddRowModal(true)}
                      >
                        + Add Custom Row
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticPressureTable;
