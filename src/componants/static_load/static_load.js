import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CommonSensorsTable from "../commonSensorsTable/commonSensorsTable";
import NavBar from "./nav_bar";
import Devices from "../devices/devices";
import StyleImport from "./style_import"; //important not delete
import classes from "./static_load.module.css";
import CommonSensorsSelector from "../commonSensorsTable/CommonSensorsSelector";
import { useDispatch } from "react-redux";
import { generalActions } from "../../store/general-slice";
import { useNavigate } from "react-router-dom";

const StaticLoad = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();

  const devicesDisabled = useSelector((state) => state.general.devicesDisabled);
  const [showModal, setShowModal] = useState(!devicesDisabled); // Open on initial render if not disabled

  useEffect(() => {
    console.log("devicesDisabled = ", devicesDisabled);
    setShowModal(!devicesDisabled);
  }, [devicesDisabled]);

  const handleCloseModal = () => {
    setShowModal(false);

    dispatch(generalActions.setDevicesDisabled({ value: true }));
    dispatch(generalActions.setCommonSensorsTableDisable({ value: true }));
    dispatch(generalActions.setStartAfterSensorSelection({ value: false }));
  };

  return (
    <>
      <NavBar />
      

      {/* Modal */}
      {showModal && (
        <div
          className="custom-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-dialog modal-xl"
            style={{
              zIndex: 1060,
              backgroundColor: "white",
              borderRadius: "8px",
              width: "90%",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Sensors</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                />
              </div>
              <div className="modal-body">
                <CommonSensorsSelector onDone={() => setShowModal(false)} closeModal = {handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Read-only display */}
      <div className={classes.sensorsSummary}>
        <CommonSensorsTable />
      </div>

      <Devices disabled={!showModal} />
    </>
  );
};

export default StaticLoad;
