// src/store/common/handleApiError.ts
import { AppDispatch } from "../";
import { openSnackbar } from "../snackbar/snackbarSlice";

export const handleApiError = (err: any) => (dispatch: AppDispatch) => {
  if (err?.isAuthExpired) {
    dispatch(
      openSnackbar({
        message: "세션이 만료되었습니다.",
        severity: "warning",
        actionType: "LOGIN",
      }),
    );
    return;
  }

  dispatch(
    openSnackbar({
      message: "알 수 없는 오류가 발생했습니다.",
      severity: "error",
    }),
  );
};
