import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  displaySidebar: false,
};

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.displaySidebar = !state.displaySidebar;
    },
  },
});

export const { toggleSidebar } = displaySlice.actions;

export default displaySlice;
