import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./userDataSlice";
import displaySlice from "./displaySlice";

const store = configureStore({
    reducer: {
        userData: userDataSlice.reducer,
        display: displaySlice.reducer
    },
  });

  export default store;