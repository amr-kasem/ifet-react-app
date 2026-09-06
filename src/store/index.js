import { configureStore } from "@reduxjs/toolkit";
import deviceSlice from "./sensors-slice";
import generalSlice from "./general-slice";
import testsSlice from "./testsSlice";


const store = configureStore({
    reducer:{
        // ui : uiSlice.reducer,
        // cart : cartSlice.reducer,
        general : generalSlice.reducer,
        devices : deviceSlice.reducer,
        tests: testsSlice.reducer,
    }
})

export default store