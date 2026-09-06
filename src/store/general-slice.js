

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   toggleBtn : "static_load"
// };

// const generalSlice = createSlice({
//   name: "devices",
//   initialState: initialState,
//   reducers: {
//     readToggle(state, action) {
//       state.toggleBtn = action.payload.toggleValue
//     },

//   },
// });

// export const generalActions = generalSlice.actions;
// export default generalSlice;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PositiveSetpoint:0,
  NegativeSetpoint:0,
  NumberOfCycles:0,
  payload:{},
  commonSensorsTableDisable: true,
  startAfterSensorSelection: false,
  devicesDisabled: true,  // Add state for Devices disabled
  selectedCommonSensorIDs: [],
  appDataReloadKey: 0, // bumped when Sync=0 soft-reloads app bootstrap data
  };





const generalSlice = createSlice({
  name: "parameters",
  initialState: initialState,
  reducers: {
    setParametersFromTable(state, action) {
      state.PositiveSetpoint = action.payload.PositiveSetpoint
      state.NegativeSetpoint = action.payload.NegativeSetpoint
      state.NumberOfCycles = action.payload.NumberOfCycles
    },
    setPayload(state,action){
      state.payload = action.payload.value
    },
    setCommonSensorsTableDisable(state,action){
      state.commonSensorsTableDisable = action.payload.value
    },
    setStartAfterSensorSelection(state, action) {
      state.startAfterSensorSelection = action.payload.value;
    },
    setDevicesDisabled(state, action) {
      state.devicesDisabled = action.payload.value; // New action for disabling Devices
      console.log("merz",state.devicesDisabled)
    },
    setSelectedCommonSensorIDs(state, action) {
      state.selectedCommonSensorIDs = action.payload;
    },
    bumpAppDataReload(state) {
      state.appDataReloadKey += 1;
    },
  },
});

export const generalActions = generalSlice.actions;
export default generalSlice;

