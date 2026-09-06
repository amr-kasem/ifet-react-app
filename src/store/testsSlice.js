import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   missileTest: [],
//   cyclicTest: { inward: [], outward: [] },
//   staticTest: { inward: [], outward: [] },
//   infiltrationTest: { air: [], water: [] },
// };

const initialState = {
  staticTest: [],
  infiltrationTest: [],
  missileTest: [],
  cyclicTest: []
};

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    initializeMissileTest: (state, action) => {
      state.missileTest = action.payload || [];
    },
    addMissileTestRow: (state, action) => {
      state.missileTest.push(action.payload); // Add the new row to the existing array
    },
    addCyclicTestRow(state, action) {
      state.cyclicTest[action.payload.type].push(action.payload.data);
    },
    addStaticTestRow(state, action) {
      state.staticTest[action.payload.type].push(action.payload.data);
    },
    addInfiltrationTestRow(state, action) {
      state.infiltrationTest[action.payload.type].push(action.payload.data);
    },
  },
});

export const {
  addMissileTestRow,
  addCyclicTestRow,
  addStaticTestRow,
  addInfiltrationTestRow,
  initializeMissileTest,
} = testsSlice.actions;

export default testsSlice;
