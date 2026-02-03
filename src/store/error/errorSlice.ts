import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorSliceState {
  message: string | null;
  open: boolean;
}

const errorIniialState: ErrorSliceState = {
  message: null,
  open: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState: errorIniialState,
  reducers: {
    openSnackbar(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.open = true;
    },
    closeSnackbar(state) {
      state.open = false;
      state.message = null;
    },
  },
});

export const { openSnackbar, closeSnackbar } = errorSlice.actions;
export default errorSlice.reducer;
