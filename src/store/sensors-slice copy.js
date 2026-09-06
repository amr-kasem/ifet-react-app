import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching the initial device data
export const fetchDeviceData = createAsyncThunk(
  "devices/fetchDeviceData",
  async () => {
    const response = await fetch(`http://${window.location.host}/config.json`); //user
    // const response = await fetch(`http://${window.location.hostname}/config.json`); //me
    const data = await response.json();
    console.log("devices (initial load) = ", data);
    return data; // This will be the payload for the fulfilled action
  }
);

export const fetchCommonValvesData = createAsyncThunk(
  "devices/fetchCommonValvesData",
  async () => {
    const response = await fetch(`http://${window.location.host}/configCommonValves.json`); //user
    // const response = await fetch(`http://${window.location.hostname}/configCommonValves.json`); //me
    const data = await response.json();
    console.log("CommonValves (initial load) = ", data);
    return data; // This will be the payload for the fulfilled action
  }
);

export const fetchCommonSensorsData = createAsyncThunk(
  "devices/fetchCommonSensorsData",
  async () => {
    const response = await fetch(`http://${window.location.host}/configCommonSensors.json`); //user
    // const response = await fetch(`http://${window.location.hostname}/configCommonSensors.json`); //me
    const data = await response.json();
    console.log("CommonSensors (initial load) = ", data);
    return data; // This will be the payload for the fulfilled action
  }
);

// Async thunk for fetching additional turbo data for each device
export const fetchTurboData = createAsyncThunk(
  "devices/fetchTurboData",
  async () => {
    try {
      const response = await axios.get(`http://${window.location.hostname}:8000/devices/`);
      const data = response.data;
      console.log("turbo data = ", data);
      return data;
    } catch (error) {
      console.error("Error fetching turbo data:", error);
      throw error;
    }
  }
);

const initialState = {
  devices: [],
  allTopics: [],
  commonValves : [],
  commonSensors : [],
};

const generateTopicsForDevice = (deviceID, sensors, numOfValves) => {
  let sensorsArray = Object.values(sensors);
  const topics = [];
  topics.push(`device${deviceID}/status`);
  sensorsArray.forEach((sensor) => {
    topics.push(`device${deviceID}/sensors/${sensor.address}`);
  });
  topics.push(`device${deviceID}/valves/status`);
  topics.push(`device${deviceID}/vfd/command`);
  topics.push(`device${deviceID}/vfd/feedback`);

  topics.push(`device${deviceID}/resume_status`);
  topics.push(`device${deviceID}/current_test_index`);
  // console.log('generated topics')

  topics.push(`device${deviceID}/initial_value`);
  topics.push(`device${deviceID}/notify`);

  // common valves
  topics.push("turbo/valves/status");
  return topics;
};

const generateTopicsForCommonSensors = (sensors) => {
  const topics = [];
  console.log("### sensors = ",sensors)
  sensors.forEach(sensor => {
    topics.push(`sick/sensors/${sensor.ID}`);
  });
  return topics;
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {

    // GetallTopics(state) {
    //   state.allTopics = state.devices.reduce((acc, device) => {
    //     const topicsForDevice = generateTopicsForDevice(
    //       device.deviceID,
    //       device.sensors,
    //       device.numOfValves // Assuming numOfValves is available in the device object
    //     );
    //     return [...acc, ...topicsForDevice];
    //   }, []);
    // },

    GetallTopics(state) {
      let allTopics = state.devices.reduce((acc, device) => {
        const topicsForDevice = generateTopicsForDevice(
          device.deviceID,
          device.sensors,
          device.numOfValves
        );
        return [...acc, ...topicsForDevice];
      }, []);
    
      // Add topics from common sensors
      const commonSensorTopics = generateTopicsForCommonSensors(state.commonSensors);
      allTopics = [...allTopics, ...commonSensorTopics];
    
      state.allTopics = allTopics;
      // console.log("### topic = ",allTopics)
    },
    

    readSensors(state, action) {
      state.devices.forEach((device) => {
        device.sensors.forEach((sensor) => {
          if (action.payload.deviceID === device.deviceID) {
            if (sensor.address == action.payload.sensorID) {
              sensor.value = action.payload.value;
            }
          }
        });
      });
    },

    readValves(state, action) {
      state.devices.forEach((device) => {
        device.valves.forEach((valve) => {
          if (action.payload.deviceID === device.deviceID) {
            if (valve.name == action.payload.valveID) {
              valve.value = action.payload.value;
              // console.log("in slice",valve.name,valve.value)
            }
          }
        });
      });
    },

    readCommonValves(state, action) {
        state.commonValves.forEach((valve) => {
            if (valve.name == action.payload.valveID) {
              valve.value = action.payload.value;
            }
        });
    },

    readCommonSensors(state, action) {
      state.commonSensors.forEach((sensor) => {
          if (sensor.ID == action.payload.ID) {
            sensor.value = action.payload.value;
            sensor.maxValue = action.payload.maxValue;
            sensor.PermanentValue = action.payload.PermanentValue;
            sensor.assignedTo = action.payload.assignedTo;
          }
      });
  },


    readStatus(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.status = action.payload.value;
        }
      });
    },
    readVdfCurrentSpeed(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.current_speed = action.payload.value;
        }
      });
    },
    readToggle(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.toggleBtn = action.payload.value;
          // console.log("toggleinStore",device.toggleBtn)
        }
      });
    },

    readDisable(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.turbo_disable = action.payload.value;
          console.log("in slice ", device.deviceID, device.turbo_disable);
        }
      });
    },

    readTurbo(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.Turbo = action.payload.value;
          console.log("TurboinStore", device.Turbo);
        }
      });
    },

    readCustomPresetToggle(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.custom_preset_toggle = action.payload.value;
          console.log("inStore", device.custom_preset_toggle);
        }
      });
    },

    readResumeData(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.resume_data = action.payload.value;
        }
      });
    },

    readCurrentTestIndex(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          // device.current_test = action.payload.value;
          device.current_index = action.payload.value;
        }
      });
    },

    readInit(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.init = action.payload.value;
        }
      });
    },

    readUserIndex(state, action) {
      state.devices.forEach((device) => {
        // console.log("omda Comparing:", action.payload.deviceID, device.deviceID);
        // console.log("omda user_index changed to ",action.payload.value)
        if (action.payload.deviceID === device.deviceID) {
          device.user_index = action.payload.value;
          localStorage.setItem(
            `user_index_${device.deviceID}`,
            device.user_index
          );
        }
        // console.log("omda user_index after change ",device.user_index)
      });
    },

    readCyclicTestsList(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.CyclicTests = [...action.payload.value];
          // console.log("Cyclic_inStore",device.CyclicTests)
        }
      });
    },

    readStaticTestsList(state, action) {
      state.devices.forEach((device) => {
        if (action.payload.deviceID === device.deviceID) {
          device.StaticTests = [...action.payload.value];
          // console.log("Static_inStore",device.StaticTests)
        }
      });
    },

    setCustomStaticRows(state, action) {
      const { deviceID, rows } = action.payload;
      state.devices.forEach(device => {
        if (device.deviceID === deviceID) {
          device.customStaticRows = rows;
          console.log("in slice customStaticRows = ",device.customStaticRows)
        }
      });
    },

    setPresetStaticRows(state, action) {
      const { deviceID, rows } = action.payload;
      state.devices.forEach(device => {
        if (device.deviceID === deviceID) {
          device.presetStaticRows = rows;
          console.log("in slice presetStaticRows = ",device.presetStaticRows)
        }
      });
    },
    
    setCustomCyclicRows(state, action) {
      const { deviceID, rows } = action.payload;
      state.devices.forEach(device => {
        if (device.deviceID === deviceID) {
          device.customCyclicRows = rows;
          console.log("in slice customCyclicRows = ",device.customCyclicRows)
        }
      });
    },

    setPresetCyclicRows(state, action) {
      const { deviceID, rows } = action.payload;
      state.devices.forEach(device => {
        if (device.deviceID === deviceID) {
          device.presetCyclicRows = rows;
          console.log("in slice presetCyclicRows = ",device.presetCyclicRows)
        }
      });
    },

    addCustomStaticRow(state, action) {
  const { deviceID, row } = action.payload;
  state.devices.forEach(device => {
    if (device.deviceID === deviceID) {
      const newRow = {
        ...row,
        id: row.id || Date.now(),
      };
      device.customStaticRows = [...device.customStaticRows, newRow];
      console.log("in slice added customStaticRow = ", device.customStaticRows);
    }
  });
},

addCustomCyclicRow(state, action) {
  const { deviceID, row } = action.payload;
  state.devices.forEach(device => {
    if (device.deviceID === deviceID) {
      const newRow = {
        ...row,
        id: row.id || Date.now(),
      };
      device.customCyclicRows = [...device.customCyclicRows, newRow];
      console.log("in slice added customCyclicRow = ", device.customCyclicRows);
    }
  });
},
    
    

    setAllPageStatus(state, action) {
      state.devices = state.devices.map((device) => {
        if (device.deviceID === action.payload.deviceID) {
          // console.log("================", action.payload);
          // console.log(device.init)
          if (action.payload.mqtt_init == true && device.init == false) {
            // console.log("mqttTrue", action.payload);
            return {
              ...device,
              init: true,
              Temperature: action.payload.Temperature ?? device.Temperature,
              Humidity: action.payload.Humidity ?? device.Humidity,
              toggle: action.payload.toggle ?? device.toggle,
              Turbo: action.payload.Turbo ?? device.Turbo,
              turbo_slave: action.payload.turbo_slave ?? device.turbo_slave,
              turbo_mode: action.payload.turbo_mode ?? device.turbo_mode,
              turbo_charger: action.payload.turbo_charger ?? device.turbo_charger,
              wardToggle: action.payload.wardToggle ?? device.wardToggle,
              notify: action.payload.notify ?? device.notify,

              static_values_sensor: action.payload.static_values_sensor ?? device.static_values_sensor,
              static_values_SetPoint: action.payload.static_values_SetPoint ?? device.static_values_SetPoint,
              static_values_HoldTime: action.payload.static_values_HoldTime ?? device.static_values_HoldTime,

              project_name: action.payload.project_name ?? device.project_name,
              design_load_positive: action.payload.design_load_positive ?? device.design_load_positive,
              design_load_negative: action.payload.design_load_negative ?? device.design_load_negative,

              current_index: action.payload.current_index ?? device.current_index,

              cyclic_values_high_pressure: action.payload.cyclic_values_high_pressure ?? device.cyclic_values_high_pressure,
              cyclic_values_low_pressure: action.payload.cyclic_values_low_pressure ?? device.cyclic_values_low_pressure,
              cyclic_values_number_of_cycles: action.payload.cyclic_values_number_of_cycles ?? device.cyclic_values_number_of_cycles,

              current_index_1_positive: action.payload.current_index_1_positive ?? device.current_index_1_positive,
              current_index_1_Negative: action.payload.current_index_1_Negative ?? device.current_index_1_Negative,
              current_index_1_cycles: action.payload.current_index_1_cycles ?? device.current_index_1_cycles,
              current_index_2_positive: action.payload.current_index_2_positive ?? device.current_index_2_positive,
              current_index_2_Negative: action.payload.current_index_2_Negative ?? device.current_index_2_Negative,
              current_index_2_cycles: action.payload.current_index_2_cycles ?? device.current_index_2_cycles,
              current_index_3_positive: action.payload.current_index_3_positive ?? device.current_index_3_positive,
              current_index_3_Negative: action.payload.current_index_3_Negative ?? device.current_index_3_Negative,
              current_index_3_cycles: action.payload.current_index_3_cycles ?? device.current_index_3_cycles,
              current_index_4_positive: action.payload.current_index_4_positive ?? device.current_index_4_positive,
              current_index_4_Negative: action.payload.current_index_4_Negative ?? device.current_index_4_Negative,
              current_index_4_cycles: action.payload.current_index_4_cycles ?? device.current_index_4_cycles,
              current_index_5_positive: action.payload.current_index_5_positive ?? device.current_index_5_positive,
              current_index_5_Negative: action.payload.current_index_5_Negative ?? device.current_index_5_Negative,
              current_index_5_cycles: action.payload.current_index_5_cycles ?? device.current_index_5_cycles,
              current_index_6_positive: action.payload.current_index_6_positive ?? device.current_index_6_positive,
              current_index_6_Negative: action.payload.current_index_6_Negative ?? device.current_index_6_Negative,
              current_index_6_cycles: action.payload.current_index_6_cycles ?? device.current_index_6_cycles,
              current_index_7_positive: action.payload.current_index_7_positive ?? device.current_index_7_positive,
              current_index_7_Negative: action.payload.current_index_7_Negative ?? device.current_index_7_Negative,
              current_index_7_cycles: action.payload.current_index_7_cycles ?? device.current_index_7_cycles,
              current_index_8_positive: action.payload.current_index_8_positive ?? device.current_index_8_positive,
              current_index_8_Negative: action.payload.current_index_8_Negative ?? device.current_index_8_Negative,
              current_index_8_cycles: action.payload.current_index_8_cycles ?? device.current_index_8_cycles,

              current_index_1_finished: action.payload.current_index_1_finished ?? device.current_index_1_finished,
              current_index_2_finished: action.payload.current_index_2_finished ?? device.current_index_2_finished,
              current_index_3_finished: action.payload.current_index_3_finished ?? device.current_index_3_finished,
              current_index_4_finished: action.payload.current_index_4_finished ?? device.current_index_4_finished,
              current_index_5_finished: action.payload.current_index_5_finished ?? device.current_index_5_finished,
              current_index_6_finished: action.payload.current_index_6_finished ?? device.current_index_6_finished,
              current_index_7_finished: action.payload.current_index_7_finished ?? device.current_index_7_finished,
              current_index_8_finished: action.payload.current_index_8_finished ?? device.current_index_8_finished,

              static_index_1_pressure: action.payload.static_index_1_pressure ?? device.static_index_1_pressure,
              static_index_1_duration: action.payload.static_index_1_duration ?? device.static_index_1_duration,
              static_index_2_pressure: action.payload.static_index_2_pressure ?? device.static_index_2_pressure,
              static_index_2_duration: action.payload.static_index_2_duration ?? device.static_index_2_duration,
              static_index_3_pressure: action.payload.static_index_3_pressure ?? device.static_index_3_pressure,
              static_index_3_duration: action.payload.static_index_3_duration ?? device.static_index_3_duration,
              static_index_4_pressure: action.payload.static_index_4_pressure ?? device.static_index_4_pressure,
              static_index_4_duration: action.payload.static_index_4_duration ?? device.static_index_4_duration,
              static_index_5_pressure: action.payload.static_index_5_pressure ?? device.static_index_5_pressure,
              static_index_5_duration: action.payload.static_index_5_duration ?? device.static_index_5_duration,
              static_index_6_pressure: action.payload.static_index_6_pressure ?? device.static_index_6_pressure,
              static_index_6_duration: action.payload.static_index_6_duration ?? device.static_index_6_duration,
              static_index_1_finished: action.payload.static_index_1_finished ?? device.static_index_1_finished,
              static_index_2_finished: action.payload.static_index_2_finished ?? device.static_index_2_finished,
              static_index_3_finished: action.payload.static_index_3_finished ?? device.static_index_3_finished,
              static_index_4_finished: action.payload.static_index_4_finished ?? device.static_index_4_finished,
              static_index_5_finished: action.payload.static_index_5_finished ?? device.static_index_5_finished,
              static_index_6_finished: action.payload.static_index_6_finished ?? device.static_index_6_finished,
            };
          } else {
            // console.log("mqttFalse", action.payload);
            // console.log("omda current_index changed to ",action.payload.current_index)
            return {
              ...device,
              Temperature: action.payload.Temperature ?? device.Temperature,
              Humidity: action.payload.Humidity ?? device.Humidity,
              toggle: action.payload.toggle ?? device.toggle,
              Turbo: action.payload.Turbo ?? device.Turbo,
              turbo_slave: action.payload.turbo_slave ?? device.turbo_slave,
              turbo_mode: action.payload.turbo_mode ?? device.turbo_mode,
              turbo_charger: action.payload.turbo_charger ?? device.turbo_charger,
              wardToggle: action.payload.wardToggle ?? device.wardToggle,
              notify: action.payload.notify ?? device.notify,

              static_values_sensor: action.payload.static_values_sensor ?? device.static_values_sensor,
              static_values_SetPoint: action.payload.static_values_SetPoint ?? device.static_values_SetPoint,
              static_values_HoldTime: action.payload.static_values_HoldTime ?? device.static_values_HoldTime,

              project_name: action.payload.project_name ?? device.project_name,
              design_load_positive: action.payload.design_load_positive ?? device.design_load_positive,
              design_load_negative: action.payload.design_load_negative ?? device.design_load_negative,

              current_index: action.payload.current_index ?? device.current_index,

              cyclic_values_high_pressure: action.payload.cyclic_values_high_pressure ?? device.cyclic_values_high_pressure,
              cyclic_values_low_pressure: action.payload.cyclic_values_low_pressure ?? device.cyclic_values_low_pressure,
              cyclic_values_number_of_cycles: action.payload.cyclic_values_number_of_cycles ?? device.cyclic_values_number_of_cycles,

              current_index_1_positive: action.payload.current_index_1_positive ?? device.current_index_1_positive,
              current_index_1_Negative: action.payload.current_index_1_Negative ?? device.current_index_1_Negative,
              current_index_1_cycles: action.payload.current_index_1_cycles ?? device.current_index_1_cycles,
              current_index_2_positive: action.payload.current_index_2_positive ?? device.current_index_2_positive,
              current_index_2_Negative: action.payload.current_index_2_Negative ?? device.current_index_2_Negative,
              current_index_2_cycles: action.payload.current_index_2_cycles ?? device.current_index_2_cycles,
              current_index_3_positive: action.payload.current_index_3_positive ?? device.current_index_3_positive,
              current_index_3_Negative: action.payload.current_index_3_Negative ?? device.current_index_3_Negative,
              current_index_3_cycles: action.payload.current_index_3_cycles ?? device.current_index_3_cycles,
              current_index_4_positive: action.payload.current_index_4_positive ?? device.current_index_4_positive,
              current_index_4_Negative: action.payload.current_index_4_Negative ?? device.current_index_4_Negative,
              current_index_4_cycles: action.payload.current_index_4_cycles ?? device.current_index_4_cycles,
              current_index_5_positive: action.payload.current_index_5_positive ?? device.current_index_5_positive,
              current_index_5_Negative: action.payload.current_index_5_Negative ?? device.current_index_5_Negative,
              current_index_5_cycles: action.payload.current_index_5_cycles ?? device.current_index_5_cycles,
              current_index_6_positive: action.payload.current_index_6_positive ?? device.current_index_6_positive,
              current_index_6_Negative: action.payload.current_index_6_Negative ?? device.current_index_6_Negative,
              current_index_6_cycles: action.payload.current_index_6_cycles ?? device.current_index_6_cycles,
              current_index_7_positive: action.payload.current_index_7_positive ?? device.current_index_7_positive,
              current_index_7_Negative: action.payload.current_index_7_Negative ?? device.current_index_7_Negative,
              current_index_7_cycles: action.payload.current_index_7_cycles ?? device.current_index_7_cycles,
              current_index_8_positive: action.payload.current_index_8_positive ?? device.current_index_8_positive,
              current_index_8_Negative: action.payload.current_index_8_Negative ?? device.current_index_8_Negative,
              current_index_8_cycles: action.payload.current_index_8_cycles ?? device.current_index_8_cycles,

              current_index_1_finished: action.payload.current_index_1_finished ?? device.current_index_1_finished,
              current_index_2_finished: action.payload.current_index_2_finished ?? device.current_index_2_finished,
              current_index_3_finished: action.payload.current_index_3_finished ?? device.current_index_3_finished,
              current_index_4_finished: action.payload.current_index_4_finished ?? device.current_index_4_finished,
              current_index_5_finished: action.payload.current_index_5_finished ?? device.current_index_5_finished,
              current_index_6_finished: action.payload.current_index_6_finished ?? device.current_index_6_finished,
              current_index_7_finished: action.payload.current_index_7_finished ?? device.current_index_7_finished,
              current_index_8_finished: action.payload.current_index_8_finished ?? device.current_index_8_finished,

              static_index_1_pressure: action.payload.static_index_1_pressure ?? device.static_index_1_pressure,
              static_index_1_duration: action.payload.static_index_1_duration ?? device.static_index_1_duration,
              static_index_2_pressure: action.payload.static_index_2_pressure ?? device.static_index_2_pressure,
              static_index_2_duration: action.payload.static_index_2_duration ?? device.static_index_2_duration,
              static_index_3_pressure: action.payload.static_index_3_pressure ?? device.static_index_3_pressure,
              static_index_3_duration: action.payload.static_index_3_duration ?? device.static_index_3_duration,
              static_index_4_pressure: action.payload.static_index_4_pressure ?? device.static_index_4_pressure,
              static_index_4_duration: action.payload.static_index_4_duration ?? device.static_index_4_duration,
              static_index_5_pressure: action.payload.static_index_5_pressure ?? device.static_index_5_pressure,
              static_index_5_duration: action.payload.static_index_5_duration ?? device.static_index_5_duration,
              static_index_6_pressure: action.payload.static_index_6_pressure ?? device.static_index_6_pressure,
              static_index_6_duration: action.payload.static_index_6_duration ?? device.static_index_6_duration,

              static_index_1_finished: action.payload.static_index_1_finished ?? device.static_index_1_finished,
              static_index_2_finished: action.payload.static_index_2_finished ?? device.static_index_2_finished,
              static_index_3_finished: action.payload.static_index_3_finished ?? device.static_index_3_finished,
              static_index_4_finished: action.payload.static_index_4_finished ?? device.static_index_4_finished,
              static_index_5_finished: action.payload.static_index_5_finished ?? device.static_index_5_finished,
              static_index_6_finished: action.payload.static_index_6_finished ?? device.static_index_6_finished,
            };
          }
        }
        return device;
      });
    },
  },
  

  extraReducers: (builder) => {
    // Handle the fulfilled state for initial device data
    builder.addCase(fetchDeviceData.fulfilled, (state, action) => {
      state.devices = action.payload.map((device) => ({
        deviceID: parseInt(device.device_id.replace("device", "")),
        deviceName: device.device_id,
        status: device.status,
        toggleBtn: device.toggleBtn,
        current_speed: device.current_speed,
        sensors: device.sensors,
        valves: device.valves,
        valves_status: { ...device.valves_status },
        numOfValves: Object.keys(device.valves).length,
        resume_data: {},
        current_test: "0",

        // new update
        init: false,

        Temperature: 0,
        Humidity: 0,
        toggle: device.toggleBtn,

        static_values_sensor: 0,
        static_values_SetPoint: 0,
        static_values_HoldTime: 0,

        project_name: "",
        design_load_positive: 0,
        design_load_negative: 0,

        current_index: 0,
        user_index: 0,

        cyclic_values_high_pressure: 0,
        cyclic_values_low_pressure: 0,
        cyclic_values_number_of_cycles: 0,

        current_index_1_positive: 0,
        current_index_1_Negative: 0,
        current_index_1_cycles: 0,

        current_index_2_positive: 0,
        current_index_2_Negative: 0,
        current_index_2_cycles: 0,

        current_index_3_positive: 0,
        current_index_3_Negative: 0,
        current_index_3_cycles: 0,

        current_index_4_positive: 0,
        current_index_4_Negative: 0,
        current_index_4_cycles: 0,

        current_index_5_positive: 0,
        current_index_5_Negative: 0,
        current_index_5_cycles: 0,

        current_index_6_positive: 0,
        current_index_6_Negative: 0,
        current_index_6_cycles: 0,

        current_index_7_positive: 0,
        current_index_7_Negative: 0,
        current_index_7_cycles: 0,

        current_index_8_positive: 0,
        current_index_8_Negative: 0,
        current_index_8_cycles: 0,

        current_index_1_finished: "",
        current_index_2_finished: "",
        current_index_3_finished: "",
        current_index_4_finished: "",
        current_index_5_finished: "",
        current_index_6_finished: "",
        current_index_7_finished: "",
        current_index_8_finished: "",

        static_index_1_pressure: 0,
        static_index_1_duration: 0,
        static_index_2_pressure: 0,
        static_index_2_duration: 0,
        static_index_3_pressure: 0,
        static_index_3_duration: 0,
        static_index_4_pressure: 0,
        static_index_4_duration: 0,
        static_index_5_pressure: 0,
        static_index_5_duration: 0,
        static_index_6_pressure: 0,
        static_index_6_duration: 0,

        static_index_1_finished: "",
        static_index_2_finished: "",
        static_index_3_finished: "",
        static_index_4_finished: "",
        static_index_5_finished: "",
        static_index_6_finished: "",

        custom_preset_toggle: "Custom",

        CyclicTests: [],
        StaticTests: [],

        Turbo: "",

        // Initialize turbo-related fields here to be updated later
        turbo_charger: null,
        turbo_mode: false,
        turbo_slave: false,
        id: 0,

        wardToggle: "inward",

        turbo_disable: "",

        notify:false,

        customStaticRows: [],
        customCyclicRows: [],
        presetStaticRows: [],
        presetCyclicRows: [],


      }));
    });

    // Handle the fulfilled state for additional turbo data
    builder.addCase(fetchTurboData.fulfilled, (state, action) => {
      action.payload.forEach((turboDevice) => {
        // Parse deviceID from the turboDevice name
        // const deviceID = parseInt(turboDevice.name.replace("device", ""));
        const deviceID = turboDevice.id;
        // Find the matching device in the state
        // console.log("xxxxx", state.devices[2].deviceID);
        const device = state.devices.find((d) => d.deviceID === deviceID);

        // Update turbo properties if the device exists
        if (device) {
          // console.log("xxx", device.deviceID, turboDevice.id);
          device.turbo_charger =
            turboDevice.turbo_charger ?? device.turbo_charger;
          device.turbo_mode = turboDevice.turbo_mode ?? device.turbo_mode;
          device.turbo_slave = turboDevice.turbo_slave ?? device.turbo_slave;
          device.deviceID = turboDevice.id ?? device.deviceID;
        } else {
          console.warn(`Device with ID ${deviceID} not found in state.devices`);
        }
      });
    });

    builder.addCase(fetchCommonValvesData.fulfilled, (state, action) => {
      state.commonValves = action.payload.map((valve) => ({
        valveID: parseInt(valve.address),  // Using address to uniquely identify the valve
        name: valve.name,
        pin: valve.pin,
        role: valve.role,
        value: valve.value,
        address: valve.address,
        // Add any other necessary default values for your application
        init: false,
        customPresetToggle: "Custom",
      }));
    });

    builder.addCase(fetchCommonSensorsData.fulfilled, (state, action) => {
      state.commonSensors = action.payload.map((sensor) => ({
        ID: sensor.ID,
        value: sensor.value,
        maxValue: sensor.maxValue,
        PermanentValue: sensor.PermanentValue,
        assignedTo: sensor.assignedTo,
      }));
    });
    
  },
});

export const devicesActions = deviceSlice.actions;
export default deviceSlice;
