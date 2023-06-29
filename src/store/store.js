import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./userDataSlice";

const store = configureStore({
    reducer: {
        userData: userDataSlice.reducer,
    },
  });

  export default store;