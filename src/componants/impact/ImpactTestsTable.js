import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ConfirmationModal from "../Modals/ConfirmationModal";
import ImpactAttemptsModal from "./ImpactAttemptsModal";
import ImpactTestAddModal from "./ImpactTestAddModal";
import { devicesActions } from "../../store/sensors-slice";
import styles from "./ImpactTestsTable.module.css";
import {
  createImpactTest,
  finishImpactTest,
  impactError,
  listImpactTests,
} from "./impactApi";

// missile / missile_weight are nullable, as are a shot's area / velocity.
const orDash = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

const ImpactTestsTable = ({ projectID, neededDevice, status }) => {
  const dispatch = useDispatch();

  const tests = neededDevice.impactRows || [];
  const [openAttempts, setOpenAttempts] = useState(null); // the test being viewed
  const [showAdd, setShowAdd] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!projectID) return;
    try {
      const rows = await listImpactTests(projectID);
      // The store feeds both this table and the black-area dropdown.
      dispatch(
        devicesActions.readImpactRows({
          deviceID: neededDevice.deviceID,
          rows,
        })
      );
    } catch (err) {
      console.error("Could not load impact tests", err);
      setError(impactError(err, "Could not load impact tests."));
    }
  };

  useEffect(() => {
    load();
  }, [projectID]);

  const handleAdd = async (body) => {
    try {
      setBusy(true);
      await createImpactTest(projectID, body);
      setShowAdd(false);
      await load();
    } catch (err) {
      setError(impactError(err, "Could not create the impact test."));
    } finally {
      setBusy(false);
    }
  };

  const handleFinishConfirm = async () => {
    const test = pendingFinish;
    setPendingFinish(null);
    try {
      await finishImpactTest(projectID, test.id);
      await load();
    } catch (err) {
      setError(impactError(err, "Could not mark the test finished."));
    }
  };

  const latestVerdict = (test) => {
    const trials = test.trials || [];
    if (trials.length === 0) return "—";
    const last = trials[trials.length - 1];
    // Pending after finish is correct: tested, awaiting review.
    return last.test_result || "Pending";
  };

  const operatorCall = (test) => {
    const trials = test.trials || [];
    if (trials.length === 0) return "—";
    const last = trials[trials.length - 1];
    if (last.status === "Aborted") return "Aborted";
    if (last.result === null || last.result === undefined) return "—";
    return last.result ? "Resisted" : "Did not resist";
  };

  return (
    <>
      <ImpactTestAddModal
        visible={showAdd}
        busy={busy}
        onCancel={() => setShowAdd(false)}
        onSave={handleAdd}
      />

      <ImpactAttemptsModal
        visible={openAttempts !== null}
        test={tests.find((t) => t.id === openAttempts) || null}
        operatorName={
          localStorage.getItem(`impact_operator_${neededDevice.deviceID}`) || ""
        }
        onChanged={load}
        onClose={() => setOpenAttempts(null)}
      />

      <ConfirmationModal
        visible={pendingFinish !== null}
        title="Finish Impact Test"
        message="Mark this impact test as finished? No further attempts can be started on it."
        confirmText="Finish"
        cancelText="Cancel"
        onCancel={() => setPendingFinish(null)}
        onConfirm={handleFinishConfirm}
      />

      <div className="row">
        <div className="col-6 col-md-5 col-lg-4 mt-3">
          <h4>Impact Tests</h4>
        </div>
        <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
          <button
            type="button"
            className="btn btn-primary btn-lg me-2"
            disabled={status !== "idle" || !projectID}
            onClick={() => setShowAdd(true)}
          >
            Add Impact Test
          </button>
        </div>
      </div>

      {error && (
        <div className="row">
          <div className="col">
            {/* The detail strings say what to do next, so show them. */}
            <div className={styles.error}>
              {error}
              <button
                type="button"
                className={styles.errorClose}
                onClick={() => setError("")}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table
              className="table text-center table-bordered align-middle"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "70px" }}>
                    <h6>Test</h6>
                  </th>
                  <th style={{ width: "160px" }}>
                    <h6>Missile</h6>
                  </th>
                  <th style={{ width: "90px" }}>
                    <h6>Weight</h6>
                  </th>
                  <th style={{ width: "80px" }}>
                    <h6>Attempts</h6>
                  </th>
                  <th style={{ width: "130px" }}>
                    <h6>Operator Result</h6>
                  </th>
                  <th style={{ width: "100px" }}>
                    <h6>Review</h6>
                  </th>
                  <th style={{ width: "90px" }}>
                    <h6>Test State</h6>
                  </th>
                  <th style={{ width: "80px" }}>
                    <h6>History</h6>
                  </th>
                  <th style={{ width: "90px" }}>
                    <h6>Mark as finished</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className={styles.emptyRow}>
                      {projectID
                        ? "No impact tests on this project yet."
                        : "Select a project to see its impact tests."}
                    </td>
                  </tr>
                ) : (
                  tests.map((test) => (
                    <tr key={test.id}>
                      {/* labos_test_id is on the attempt, not the test. */}
                      <td>{test.id}</td>
                      <td className={styles.wrapCell}>{orDash(test.missile)}</td>
                      <td>{orDash(test.missile_weight)}</td>
                      <td>
                        {/* A test with no attempts is normal: created, not started. */}
                        {(test.trials || []).length}
                      </td>
                      <td>{operatorCall(test)}</td>
                      <td>
                        <span
                          className={
                            latestVerdict(test) === "Pass"
                              ? styles.verdictPass
                              : latestVerdict(test) === "Fail"
                              ? styles.verdictFail
                              : styles.verdictPending
                          }
                        >
                          {latestVerdict(test)}
                        </span>
                      </td>
                      <td>{test.finished ? "Finished" : "Open"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setOpenAttempts(test.id)}
                          disabled={(test.trials || []).length === 0}
                        >
                          View
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => setPendingFinish(test)}
                          disabled={test.finished || status !== "idle"}
                        >
                          {test.finished ? "Done" : "Finish"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImpactTestsTable;
