import { createSlice } from "@reduxjs/toolkit";

const headerStickyToggle = createSlice({
  name: "HeaderSticky",
  initialState: { skicy: true },
  reducers: {
    removeSticky: (state) => {
      state.skicy = false;
    },
    addSticky: (state) => {
      state.skicy = true;
    },
  },
});

export const { removeSticky, addSticky } = headerStickyToggle.actions;
export default headerStickyToggle.reducer;
