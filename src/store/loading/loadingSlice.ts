import { createSlice } from "@reduxjs/toolkit";

interface LoadingInitialState {
  loadingCount: number;
}

const loadingInitialState: LoadingInitialState = {
  loadingCount: 0,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: loadingInitialState,
  reducers: {
    loadingStart(state) {
      state.loadingCount += 1;
    },
    loadingEnd(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
    loadingReset(state) {
      state.loadingCount = 0;
    },
  },
  extraReducers: () => {},
});

export const { loadingStart, loadingEnd, loadingReset } = loadingSlice.actions;
export default loadingSlice.reducer;
