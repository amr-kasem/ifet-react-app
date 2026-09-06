import React, { useEffect, useState } from "react";
import { devicesActions } from "../../store/sensors-slice";
import { useDispatch, useSelector } from "react-redux";
import { generalActions } from "../../store/general-slice";
import axios from "axios";

const Receiver1 = ({ devices }) => {
  let payload = useSelector((state) => state.general.payload);

  const devicesss = useSelector((state) => state.devices["devices"]);
  const commonSensors = useSelector((state) => state.devices["commonSensors"]);
  // console.log("### commonsensors" , commonSensors)

  // console.log("payload = " , payload)


  const handlePayload = (payload) => {
    if (devices != undefined && payload != {}) {
      devices.forEach((device) => {
        const deviceID = device.deviceID;

        const neededDevice = devicesss.find(
          (device) => device.deviceID === deviceID
        );
        let init = neededDevice.init;
        let status = neededDevice.status;
        let notify = neededDevice.notify;


        // resume
        const resume_topic = `device${deviceID}/resume_status`;
        if (payload.topic === resume_topic) {
          // console.log("received resume message is: ",payload.message)
          dispatch(
            devicesActions.readResumeData({
              deviceID: deviceID,
              // value: payload.message.toString(),
              value: JSON.parse(payload.message),

              // value:{
              //   command: "start",
              //   mode: "cyclic",
              //   positive: 70,
              //   negative: 80,
              //   sensor_id: 3,
              //   cycles: 4,
              //   current_cycle:2,
              //   current_test:2
              // }

              // "command": "start",
              // "mode": "cyclic",
              // "positive": 50,
              // "negative": 20,
              // "sensor_id": "1",
              // "cycles": 3

              // "test_index": 1,
            })
          );
        }




        //allPageStatus
        // const allPageStatus_topic = `device${deviceID}/initial_value`;
        // if (payload.topic == allPageStatus_topic) {
        //   // console.log("inittttttt",init)
        //   // console.log("data = ",typeof(payload.message))

        //   let recievedMsg = JSON.parse(payload.message);
        //   // console.log("init now is:",init)
          
        //   if (init === false) {
        //     console.log("init data is:",recievedMsg)
        //     dispatch(
        //       devicesActions.setAllPageStatus({
        //         deviceID: deviceID,
        //         mqtt_init: true,

        //         Temperature:recievedMsg["current_values"]["others"]["Temperature"],
        //         Humidity: recievedMsg["current_values"]["others"]["Humidity"],
        //         toggle: recievedMsg["current_values"]["others"]["toggle"],

        //         static_values_sensor: recievedMsg["current_values"]["static_values"]["sensor"],
        //         static_values_SetPoint: recievedMsg["current_values"]["static_values"]["setpoint"],
        //         static_values_HoldTime: recievedMsg["current_values"]["static_values"]["hold_time"],

        //         // m3koseen
        //         cyclic_values_high_pressure: recievedMsg["current_values"]["cyclic_values"]["high_Pressure"],
        //         cyclic_values_low_pressure: recievedMsg["current_values"]["cyclic_values"]["low_Pressure"],
        //         cyclic_values_number_of_cycles: recievedMsg["current_values"]["cyclic_values"]["number_of_cycles"],

        //         current_index:recievedMsg["current_values"]["cyclic_values"]["current_index"],

                
        //       })
        //     );
        //   }
        // }


        // notify
        const notifi_topic = `device${deviceID}/notify`;
        if (payload.topic === notifi_topic) {
          console.log("in notifi");
          // REMOVED: Problematic API call that fetches all projects without parent filtering
          // This was causing the specimen to change to the last one in the wrong parent
          // The Information component already handles project fetching properly
          console.log("in notifi - skipping project fetch to prevent specimen change issue");
          // Just update the notify flag without fetching projects
          dispatch(
            devicesActions.setAllPageStatus({
              notify: !notify,
              deviceID: deviceID,
            })
          );
          return; // Exit early to prevent the rest of the problematic code
          
          // OLD CODE (commented out):
          // axios
          //   .get(`http://${window.location.hostname}:8000/devices/${deviceID}/projects/`) //edit /
          //   .then((response) => {
          //     console.log("in notifi", response.data);
          //     // console.log("in notifi", JSON.parse(payload.message));
          //     let projectToUse = response.data[response.data.length - 1];
          //     // let projectToUse = JSON.parse(payload.message)[JSON.parse(payload.message).length - 1];
          //     // console.log("projectToUse", projectToUse);
          // 
          //     if (projectToUse) {
          // 
          //       let static_tests_sorted = projectToUse.static_tests.sort(
          //         (a, b) => a.index - b.index
          //       );
          // 
          // 
          //       let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
          //         (a, b) => a.index - b.index
          //       );
          // 
          //       dispatch(
          //         devicesActions.setAllPageStatus({
          //           notify: !notify,
          //           deviceID: deviceID,
          //           // project_name: projectToUse.name,
          //           // design_load_positive: projectToUse.inward_design_pressure,
          //           // design_load_negative: projectToUse.outward_design_pressure,
          //           // current_index: 0,
          // 
          //           // current_index_1_positive: cyclic_tests_sorted[0].high_pressure,
          //           // current_index_1_Negative: cyclic_tests_sorted[0].low_pressure,
          //           // current_index_1_cycles: cyclic_tests_sorted[0].cycles,
          // 
          //           // current_index_2_positive: cyclic_tests_sorted[1].high_pressure,
          //           // current_index_2_Negative: cyclic_tests_sorted[1].low_pressure,
          //           // current_index_2_cycles: cyclic_tests_sorted[1].cycles,
          // 
          //           // current_index_3_positive: cyclic_tests_sorted[2].high_pressure,
          //           // current_index_3_Negative: cyclic_tests_sorted[2].low_pressure,
          //           // current_index_3_cycles: cyclic_tests_sorted[2].cycles,
          // 
          //           // current_index_4_positive: cyclic_tests_sorted[3].high_pressure,
          //           // current_index_4_Negative: cyclic_tests_sorted[3].low_pressure,
          //           // current_index_4_cycles: cyclic_tests_sorted[3].cycles,
          // 
          //           // current_index_5_positive: cyclic_tests_sorted[4].high_pressure,
          //           // current_index_5_Negative: cyclic_tests_sorted[4].low_pressure,
          //           // current_index_5_cycles: cyclic_tests_sorted[4].cycles,
          // 
          //           // current_index_6_positive: cyclic_tests_sorted[5].high_pressure,
          //           // current_index_6_Negative: cyclic_tests_sorted[5].low_pressure,
          //           // current_index_6_cycles: cyclic_tests_sorted[5].cycles,
          // 
          //           // current_index_7_positive: cyclic_tests_sorted[6].high_pressure,
          //           // current_index_7_Negative: cyclic_tests_sorted[6].low_pressure,
          //           // current_index_7_cycles: cyclic_tests_sorted[6].cycles,
          // 
          //           // current_index_8_positive: cyclic_tests_sorted[7].high_pressure,
          //           // current_index_8_Negative: cyclic_tests_sorted[7].low_pressure,
          //           // current_index_8_cycles: cyclic_tests_sorted[7].cycles,
          // 
          //           // static_index_1_pressure: static_tests_sorted[0].pressure,
          //           // static_index_1_duration: static_tests_sorted[0].duration,
          //           // static_index_2_pressure: static_tests_sorted[1].pressure,
          //           // static_index_2_duration: static_tests_sorted[1].duration,
          //           // static_index_3_pressure: static_tests_sorted[2].pressure,
          //           // static_index_3_duration: static_tests_sorted[2].duration,
          //           // static_index_4_pressure: static_tests_sorted[3].pressure,
          //           // static_index_4_duration: static_tests_sorted[3].duration,
          //           // static_index_5_pressure: static_tests_sorted[4].pressure,
          //           // static_index_5_duration: static_tests_sorted[4].duration,
          //           // static_index_6_pressure: static_tests_sorted[5].pressure,
          //           // static_index_6_duration: static_tests_sorted[5].duration,
          //         })
          //       );
          //     }
          //   })
          //   .catch((error) => {
          //     console.error("There was an error fetching the projects!", error);
          //   });
        };


        // status
        const status_topic = `device${deviceID}/status`;
        if (payload.topic === status_topic) {
          dispatch(
            devicesActions.readStatus({
              deviceID: deviceID,
              value: payload.message.toString(),
            })
          );
        }

        // vfd current speed
        const vdf_topic = `device${deviceID}/vfd/feedback`;
        if (payload.topic === vdf_topic) {
          // console.log("feedback recived is ",payload.message.toString())
          dispatch(
            devicesActions.readVdfCurrentSpeed({
              deviceID: deviceID,
              value: payload.message.toString(),
            })
          );
        }

        device.sensors.forEach((sensor) => {
          const topic = `device${deviceID}/sensors/${sensor.address}`;
          // console.log(payload.topic)
          if (payload.topic === topic) {
            dispatch(
              devicesActions.readSensors({
                deviceID: deviceID,
                sensorID: sensor.address,
                value: payload.message.toString(),
              })
            );
          }
        });

        // valves

        // const valvesList = Object.entries(device.valves).map(([key, value]) => ({
        //   ...value,
        //   id: key, // Add an 'id' field to preserve the original key
        // }));

        // valvesList.forEach((valve, index) => {
        //   const topic = `device${deviceID}/valves/valve${index + 1}`;
        //   if (payload.topic === topic) {
        //     dispatch(
        //       devicesActions.readValves({
        //         deviceID: deviceID,
        //         valveID: index + 1,
        //         value: payload.message.toString(),
        //       })
        //     );
        //   }
        // });

        // const topic = `device${deviceID}/valves/status`;
        // if (payload.topic === topic) {
        //     dispatch(
        //       devicesActions.readValves({
        //         deviceID: deviceID,
        //         value: JSON.parse(payload.message.toString()),
        //       })
        //     );
        // }

        const topic = `device${deviceID}/valves/status`;
        if (payload.topic === topic) {
          const valves = JSON.parse(payload.message);
          // console.log("in receiver",valves)
          for (const key in valves) {
            if (valves.hasOwnProperty(key)) {
              const value = valves[key];
              // console.log(`Key: ${key}, Value: ${value}`);
              dispatch(
                devicesActions.readValves({
                  deviceID: deviceID,
                  valveID: key,
                  value: value,
                })
              );
            }
          }
        }

        // commonValves
        const topic2 = `turbo/valves/status`;
        if (payload.topic === topic2) {
          const valves = JSON.parse(payload.message);
          // console.log("in receiver",valves)
          for (const key in valves) {
            if (valves.hasOwnProperty(key)) {
              const value = valves[key];
              // console.log(`Key: ${key}, Value: ${value}`);
              dispatch(
                devicesActions.readCommonValves({
                  valveID: key,
                  value: value,
                })
              );
            }
          }
        }




        const topic1 = `device${deviceID}/current_test_index`;
        if (payload.topic === topic1) {
          // console.log("omda current_index of device recived",payload.message.toString())
          // console.log("current_test_r + 1 = ",parseInt(payload.message.toString())+1)
          dispatch(
            devicesActions.readCurrentTestIndex({
              deviceID: deviceID,
              value: parseInt(payload.message.toString()) + 1,
              // value: parseInt(payload.message.toString()),
            })
          );
          if(!localStorage.getItem(`user_index_${deviceID}`)){
            localStorage.setItem(`user_index_${deviceID}`,parseInt(payload.message.toString()));
          }
        }
      });
    }

    commonSensors.forEach((sensor) => {
      const topic = `sick/sensors/${sensor.ID}`
      if (payload.topic === topic) {
        const data = JSON.parse(payload.message)
        dispatch(
          devicesActions.readCommonSensors({
            ID : sensor.ID,
            value : data.value,
            maxValue : data.max_value,
            PermanentValue : data.permanent_value,
            assignedTo : data.assigned_to,
          })
        );
      }
    });
  };

  const dispatch = useDispatch();

  let [state1, setState1] = React.useState({
    person: false,
  });

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    let frame_data;

    if (payload.topic) {
      // frame_data = JSON.parse(payload.message.toString())
      handlePayload(payload);
      // console.log("recieved")
      // console.log("oooo",frame_data["sendedMessage"])

      // console.log("topic",payload.topic)
      // console.log("data",payload.message.toString())
      // console.log(`device${deviceID}/sensors/1`)

      // if (payload.topic == `device${deviceID}/sensors/1`) {
      //   dispatch(devicesActions.readSensors({
      //     deviceID : deviceID,
      //     sensorID : 1,
      //     value: payload.message.toString(),
      //   }))
      // }
      // else if (payload.topic == `device${deviceID}/sensors/2`) {
      //   dispatch(devicesActions.readSensors({
      //     deviceID : deviceID,
      //     sensorID : 2,
      //     value: payload.message.toString(),
      //   }))
      // }
      // else if (payload.topic == `device${deviceID}/sensors/3`) {
      //   dispatch(devicesActions.readSensors({
      //     deviceID : deviceID,
      //     sensorID : 3,
      //     value: payload.message.toString(),
      //   }))
      // }

      // else if (payload.topic == `device${deviceID}/valves/valve1`) {
      //   dispatch(devicesActions.readvalves({
      //     deviceID : deviceID,
      //     valveID : 1,
      //     value: payload.message.toString(),
      //   }))
      // }
      // else if (payload.topic == `device${deviceID}/valves/valve2`) {
      //   dispatch(devicesActions.readvalves({
      //     deviceID : deviceID,
      //     valveID : 2,
      //     value: payload.message.toString(),
      //   }))
      // }
      // else if (payload.topic == `device${deviceID}/valves/valve3`) {
      //   dispatch(devicesActions.readvalves({
      //     deviceID : deviceID,
      //     valveID : 3,
      //     value: payload.message.toString(),
      //   }))
      // }
      // else if (payload.topic == `device${deviceID}/valves/valve4`) {
      //   dispatch(devicesActions.readvalves({
      //     deviceID : deviceID,
      //     valveID : 4,
      //     value: payload.message.toString(),
      //   }))
      // }
    }
  }, [payload]);

  return <React.Fragment></React.Fragment>;
};

export default Receiver1;
