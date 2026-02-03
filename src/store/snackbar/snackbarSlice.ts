// src/store/snackbar/snackbarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "info" | "success" | "warning" | "error";
  actionType?: "LOGIN";
}

const initialState: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar(
      state,
      action: PayloadAction<{
        message: string;
        severity: SnackbarState["severity"];
        actionType?: "LOGIN";
      }>,
    ) {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.actionType = action.payload.actionType;
    },
    closeSnackbar(state) {
      state.open = false;
      state.actionType = undefined;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
