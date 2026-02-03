// components/GlobalSnackbar.tsx
import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/index";
import { closeSnackbar } from "../../../store/error/errorSlice";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message } = useSelector((state: RootState) => state.errorSlice);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(closeSnackbar())}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error" onClose={() => dispatch(closeSnackbar())}>
        {message}
      </Alert>
    </Snackbar>
  );
}
