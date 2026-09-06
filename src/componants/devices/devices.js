import { useDispatch, useSelector } from "react-redux";
import HookMqtt from "../Mqtt1";
import Device from "./device";
import { devicesActions, fetchDeviceData } from "../../store/sensors-slice";
import { useEffect } from "react";
import classes from "./devices.module.css";

const Devices = (props) => {
  const devices = useSelector((state) => state.devices.devices);
  // console.log('devices',devices)
  const allTopics = useSelector((state) => state.devices.allTopics);
  const dispatch = useDispatch();

  const devicesNames = devices.map((device) => device.deviceName);
  // console.log("devicesSlave", devicesSlave);

  useEffect(() => {
    dispatch(fetchDeviceData()).then(() => {
      // Once fetchDeviceData is fulfilled, dispatch GetallTopics
      dispatch(devicesActions.GetallTopics());
    });
  }, [dispatch]);

  // console.log("allTopics = ",allTopics)

  useEffect(() => {
    // console.log("try to get topics")
  }, [allTopics]);

  useEffect(()=> {

  },[props.disabled])

  return (
    <>
      <HookMqtt topics={allTopics} devices={devices} />
      <div className={classes.devicesContainer}>
        {
          !props.disabled ? 
          <div className={classes.devicesDisable}></div> : null
        }
          {devices.map((device) => (
            <div className={classes.deviceWrapper} key={device.deviceID}>
              <Device
                device={device}
                devicesNames={devicesNames}
                disabled={device.turbo_slave} // Pass disabled prop
              />
            </div>
          ))}
        {/* </div> */}
      </div>
    </>
  );
};

export default Devices;
