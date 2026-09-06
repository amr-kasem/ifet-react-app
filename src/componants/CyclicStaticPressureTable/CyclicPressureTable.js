import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import axios from "axios";
import CyclicPressureTableRow from "./CyclicPressureTableRow";
import AddRowCyclicPressureLoadingModal from "../Modals/AddRowCyclicPressureLoadingModal";
import TrialsModal from "../Modals/TrialsModal";
import ConfirmationModal from "../Modals/ConfirmationModal";

const CyclicPressureTable = (props) => {
  const devices = useSelector((state) => state.devices["devices"]);
  const dispatch = useDispatch();
  const neededDevice = devices.find(
    (device) => device.deviceID === props.neededDevice.deviceID
  );
  const status = props.neededDevice.status;
  const [showTrialsModal, setShowTrialsModal] = useState(false);
  const [selectedTrials, setSelectedTrials] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null); // Holds the row object
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(null);

  const [presetRows, setPresetRows] = useState(
    neededDevice.presetCyclicRows?.length === 8
      ? neededDevice.presetCyclicRows
      : Array.from({ length: 8 }, (_, i) => ({
          index: i,
          cycles: 0,
          high_pressure: 0,
          low_pressure: 0,
          type: i < 4 ? "inward" : "outward",
          finished: false,
          preset: true,
        }))
  );
  const [customRows, setCustomRows] = useState(
    neededDevice.customCyclicRows || []
  );
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState({
    current_cycle: 0,
    cycles: 0,
    deflection: null,
    finished: false,
    high_pressure: 0,
    index: 0,
    low_pressure: 0,
    note: null,
    permanent_set: null,
    result: null,
    resume: false,
    type: "inward",
  });

  const isValid =
    newRowData.high_pressure !== "" &&
    !isNaN(newRowData.high_pressure) &&
    newRowData.low_pressure !== "" &&
    !isNaN(newRowData.low_pressure) &&
    newRowData.cycles !== "" &&
    !isNaN(newRowData.cycles);

  // useEffect(() => {
  //   dispatch(
  //     devicesActions.setPresetCyclicRows({
  //       deviceID: props.neededDevice.deviceID,
  //       rows: presetRows,
  //     })
  //   );
  //   dispatch(
  //     devicesActions.setCustomCyclicRows({
  //       deviceID: props.neededDevice.deviceID,
  //       rows: customRows,
  //     })
  //   );
  // }, []);

  useEffect(() => {
    // Always sync with Redux store data when it changes
    if (neededDevice.presetCyclicRows && neededDevice.presetCyclicRows.length > 0) {
      console.log("CyclicPressureTable: Updating presetRows from Redux store:", neededDevice.presetCyclicRows);
      setPresetRows(neededDevice.presetCyclicRows);
    } else {
      // Initialize with default rows if no data available
      const initialPresetRows = Array.from({ length: 8 }, (_, i) => ({
        index: i,
        cycles: 0,
        high_pressure: 0,
        low_pressure: 0,
        type: i < 4 ? "inward" : "outward",
        finished: false,
        preset: true,
      }));
      setPresetRows(initialPresetRows);
    }

    // Always sync customRows with Redux store
    if (neededDevice.customCyclicRows) {
      console.log("CyclicPressureTable: Updating customRows from Redux store:", neededDevice.customCyclicRows);
      setCustomRows(neededDevice.customCyclicRows);
    } else {
      setCustomRows([]);
    }
  }, [
    neededDevice.presetCyclicRows,
    neededDevice.customCyclicRows,
    props.neededDevice.deviceID,
  ]);

  const handleInputChange = (index, value, fieldName) => {
    const updated = presetRows.map((row, i) =>
      i === index ? { ...row, [fieldName]: Number(value) } : row
    );
    setPresetRows(updated);
    dispatch(
      devicesActions.setPresetCyclicRows({
        deviceID: props.neededDevice.deviceID,
        rows: updated,
      })
    );
  };

  const handleCustomInputChange = (index, value, fieldName) => {
    const updated = customRows.map((row, i) =>
      i === index ? { ...row, [fieldName]: Number(value) } : row
    );
    setCustomRows(updated);
    dispatch(
      devicesActions.setCustomCyclicRows({
        deviceID: props.neededDevice.deviceID,
        rows: updated,
      })
    );
  };

  const handleSaveEditClick = () => {
    if (props.isEditable) {
      const allRows = [
        ...presetRows.map((row, i) => ({
          ...row,
          index: row.index,
          preset: true,
          type: row.type,
        })),
        ...customRows.map((row, i) => ({
          ...row,
          index: row.index,
          preset: false,
          type: row.type,
        })),
      ];

      // axios
      //   .put(
      //     `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests`,
      //     allRows,
      //     {
      //       headers: { "Content-Type": "application/json" },
      //     }
      //   )
      //   .then((response) => {
      //     const updatedTests = response.data.cyclic_tests;
      //     const presetSorted = updatedTests
      //       .filter((r) => r.preset)
      //       .sort((a, b) => a.index - b.index);

      //     const customSorted = updatedTests
      //       .filter((r) => !r.preset)
      //       .sort((a, b) => a.index - b.index);

      //     setPresetRows(presetSorted);
      //     setCustomRows(customSorted);

      //     dispatch(
      //       devicesActions.setPresetCyclicRows({
      //         deviceID: props.neededDevice.deviceID,
      //         rows: presetSorted,
      //       })
      //     );
      //     dispatch(
      //       devicesActions.setCustomCyclicRows({
      //         deviceID: props.neededDevice.deviceID,
      //         rows: customSorted,
      //       })
      //     );

      //     props.setIsEditable(false);
      //   })
      //   .catch((err) => console.error(err));
      axios
        .put(
          `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests`,
          allRows,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          // Ensure response contains the correct data format (full list of cyclic tests)
          const updatedTests = response.data.cyclic_tests; // This is the array you want

          // Sort the cyclic tests if necessary (based on preset or custom status)
          const presetSorted = updatedTests
            .filter((r) => r.preset)
            .sort((a, b) => a.index - b.index);
          const customSorted = updatedTests
            .filter((r) => !r.preset)
            .sort((a, b) => a.index - b.index);

          // Update state with the sorted rows
          setPresetRows(presetSorted);
          setCustomRows(customSorted);

          // Optionally, update Redux state as well
          dispatch(
            devicesActions.setPresetCyclicRows({
              deviceID: props.neededDevice.deviceID,
              rows: presetSorted,
            })
          );
          dispatch(
            devicesActions.setCustomCyclicRows({
              deviceID: props.neededDevice.deviceID,
              rows: customSorted,
            })
          );

          props.setIsEditable(false); // Disable the edit mode after saving
        })
        .catch((err) => {
          console.error(
            "Error updating cyclic tests:",
            err.response?.data || err.message
          );
        });
    } else {
      props.setIsEditable(true);
    }
  };

  const handleViewTrials = (trials) => {
    setSelectedTrials(trials);
    // for test
    // setSelectedTrials([{
    //   "trial_number": 0,
    //   "deflections": [
    //     {
    //       "deflection_gauge": 0,
    //       "max_deflection": 0,
    //       "permanent_deflection": 0,
    //       "recovery": 0
    //     },
    //   ],
    //   "id": 0
    // }])
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
        `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests/${apiIndex}/finish`
      )
      .then((res) => {
        const updatedRow = res.data;
        if (mode === "preset") {
          const updated = [...presetRows];
          updated[i] = updatedRow;
          setPresetRows(updated);
          dispatch(
            devicesActions.setPresetCyclicRows({
              deviceID: props.neededDevice.deviceID,
              rows: updated,
            })
          );
        } else {
          const updated = [...customRows];
          updated[i] = updatedRow;
          setCustomRows(updated);
          dispatch(
            devicesActions.setCustomCyclicRows({
              deviceID: props.neededDevice.deviceID,
              rows: updated,
            })
          );
        }
        closeFinishModal();
      })
      .catch((err) =>
        console.error(
          "Error marking cyclic test as finished:",
          err.response?.data || err.message
        )
      );
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
        message="Are you sure you want to delete this custom test row?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setRowToDelete(null);
          setShowDeleteModal(false);
        }}
        onConfirm={() => {
          if (!rowToDelete) return;
          axios
            .delete(
              `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic-tests/${rowToDelete.index}/`
            )
            .then(() => {
              const updated = customRows.filter(
                (r) => r.index !== rowToDelete.index
              );
              setCustomRows(updated);
              dispatch(
                devicesActions.setCustomCyclicRows({
                  deviceID: props.neededDevice.deviceID,
                  rows: updated,
                })
              );
              setRowToDelete(null);
              setShowDeleteModal(false);
            })
            .catch((err) =>
              console.error(
                "Failed to delete cyclic test row:",
                err.response?.data || err.message
              )
            );
        }}
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
        <AddRowCyclicPressureLoadingModal
          newRowData={newRowData}
          setNewRowData={setNewRowData}
          isValid={isValid}
          onCancel={() => setShowAddRowModal(false)}
          onSave={() => {
            const nextIndex = presetRows.length + customRows.length;
            const rowToSend = {
              index: nextIndex,
              cycles: Number(newRowData.cycles),
              high_pressure: Number(newRowData.high_pressure),
              low_pressure: Number(newRowData.low_pressure),
              type: newRowData.type || "inward",
              preset: false,
            };

            axios
              .post(
                `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic-tests/`,
                rowToSend,
                {
                  headers: { "Content-Type": "application/json" },
                }
              )
              .then((response) => {
                const createdRow = {
                  ...response.data, // Assuming the backend returns the full saved object
                  finished: false,
                  preset: false,
                };

                const updatedCustomRows = [...customRows, createdRow];

                setCustomRows(updatedCustomRows);
                dispatch(
                  devicesActions.setCustomCyclicRows({
                    deviceID: props.neededDevice.deviceID,
                    rows: updatedCustomRows,
                  })
                );

                setNewRowData({
                  current_cycle: 0,
                  cycles: 0,
                  deflection: null,
                  finished: false,
                  high_pressure: 0,
                  index: 0,
                  low_pressure: 0,
                  note: null,
                  permanent_set: null,
                  result: null,
                  resume: false,
                  type: "inward",
                });

                setShowAddRowModal(false);
              })
              .catch((error) => {
                console.error(
                  "Failed to create custom cyclic test row:",
                  error.response?.data || error.message
                );
              });
          }}
        />
      )}

      <div className="row">
        <div className="col-6 col-md-5 col-lg-4 mt-3">
          <h4>{props.type} Pressure Differential Loading</h4>
        </div>
        <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
          <button
            type="button"
            className={`btn btn-lg me-2 ${
              props.isEditable ? "btn-danger" : "btn-primary"
            }`}
            disabled={status !== "idle"}
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
                    <th style={{ width: "30px" }}>Loading Sequence</th>
                    <th style={{ width: "30px" }}>Loading Direction</th>
                    <th style={{ width: "150px" }}>Air Pressure Cycles</th>
                    <th style={{ width: "50px" }}>Number of Cycles</th>
                    {/* <th style={{ width: "40px" }}>Finished</th> */}
                    <th style={{ width: "30px" }}>Mark as finished</th>
                    <th style={{ width: "30px" }}>Trials</th>
                    <th style={{ width: "30px" }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-secondary">
                    <td colSpan="7">
                      <strong>Preset Loading Sequences</strong>
                    </td>
                  </tr>
                  {presetRows.map((row, index) => (
                    <CyclicPressureTableRow
                      key={`preset-${index}`}
                      sequenceNumber={index + 1}
                      loadingDirection={row.type}
                      airPressureCycles1={row.high_pressure}
                      airPressureCycles2={row.low_pressure}
                      numOfCycles={row.cycles}
                      onInputChange={(val, field) =>
                        handleInputChange(index, val, field)
                      }
                      isEditable={props.isEditable}
                      finished={row.finished}
                      isCustomRow={false}
                      trials={row.trials || []}
                      // onMarkFinishedClick={() => {
                      //   axios
                      //     .put(
                      //       `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests/${index}/finish`
                      //     )
                      //     .then((res) => {
                      //       const updatedRow = res.data;
                      //       const updated = [...presetRows];
                      //       updated[index] = updatedRow;
                      //       setPresetRows(updated);
                      //       dispatch(
                      //         devicesActions.setPresetCyclicRows({
                      //           deviceID: props.neededDevice.deviceID,
                      //           rows: updated,
                      //         })
                      //       );
                      //     })
                      //     .catch((err) =>
                      //       console.error(
                      //         "Error marking cyclic preset as finished:",
                      //         err
                      //       )
                      //     );
                      // }}
                      onMarkFinishedClick={() => {
                        axios
                          .put(
                            `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests/${row.index}/finish`
                          )
                          .then((res) => {
                            const updatedRow = res.data;
                            const updated = [...presetRows];
                            updated[index] = updatedRow;
                            setPresetRows(updated);
                            dispatch(
                              devicesActions.setPresetCyclicRows({
                                deviceID: props.neededDevice.deviceID,
                                rows: updated,
                              })
                            );
                          })
                          .catch((err) =>
                            console.error(
                              "Error marking cyclic preset as finished:",
                              err
                            )
                          );
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
                      onDeleteRow={() => {}}
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
                    <CyclicPressureTableRow
                      key={`custom-${index}`}
                      sequenceNumber={presetRows.length + index + 1}
                      loadingDirection={row.type}
                      airPressureCycles1={row.high_pressure}
                      airPressureCycles2={row.low_pressure}
                      numOfCycles={row.cycles}
                      onInputChange={(val, field) =>
                        handleCustomInputChange(index, val, field)
                      }
                      isEditable={props.isEditable}
                      finished={row.finished}
                      isCustomRow={true}
                      trials={row.trials || []}
                      // onMarkFinishedClick={() => {
                      //   axios
                      //     .put(
                      //       `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests/${row.index}/finish`
                      //     )
                      //     .then((res) => {
                      //       const updatedRow = res.data;
                      //       const updated = [...customRows];
                      //       updated[index] = updatedRow;
                      //       setCustomRows(updated);
                      //       dispatch(
                      //         devicesActions.setCustomCyclicRows({
                      //           deviceID: props.neededDevice.deviceID,
                      //           rows: updated,
                      //         })
                      //       );
                      //     })
                      //     .catch((err) =>
                      //       console.error(
                      //         "Error marking cyclic custom as finished:",
                      //         err
                      //       )
                      //     );
                      // }}
                      onMarkFinishedClick={() => {
                        axios
                          .put(
                            `http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic_tests/${row.index}/finish`
                          )
                          .then((res) => {
                            const updatedRow = res.data;
                            const updated = [...customRows];
                            updated[index] = updatedRow;
                            setCustomRows(updated);
                            dispatch(
                              devicesActions.setCustomCyclicRows({
                                deviceID: props.neededDevice.deviceID,
                                rows: updated,
                              })
                            );
                          })
                          .catch((err) =>
                            console.error(
                              "Error marking cyclic custom as finished:",
                              err
                            )
                          );
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
                      // onDeleteRow={() => {
                      //   axios
                      //     .delete(`http://${window.location.hostname}:8000/projects/${props.projectID}/cyclic-tests/${row.index}/`)
                      //     .then(() => {
                      //       const updated = [...customRows];
                      //       updated.splice(index, 1);
                      //       setCustomRows(updated);
                      //       dispatch(
                      //         devicesActions.setCustomCyclicRows({
                      //           deviceID: props.neededDevice.deviceID,
                      //           rows: updated,
                      //         })
                      //       );
                      //     })
                      //     .catch((err) =>
                      //       console.error("Failed to delete cyclic test row:", err.response?.data || err.message)
                      //     );
                      // }}
                      onDeleteRow={() => {
                        setRowToDelete(row);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}

                  <tr>
                    <td colSpan="7">
                      <button
                        className="btn btn-success"
                        onClick={() => setShowAddRowModal(true)}
                        disabled={status !== "idle"}
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

export default CyclicPressureTable;
