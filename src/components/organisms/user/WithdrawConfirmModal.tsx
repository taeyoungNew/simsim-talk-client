import { useState } from "react";
import CommonModal from "../../molecules/common/modal/CommonModal";
import { Box, Button, Typography } from "@mui/material";
import { SimSimTextField } from "../../atoms/inputs/SimsimTextField";
import { theme } from "../../../theme/theme";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "../../../store/hook";
import { deleteUserThunk } from "../../../store/user/userThunk";
import { logoutThunk } from "../../../store/auth/authThunk";

interface WithdrawConfirmModalProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export default function WithdrawConfirmModal({
  userId,
  open,
  onClose,
}: WithdrawConfirmModalProps) {
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  interface DeleteUser {
    password: string;
  }

  const { handleSubmit, control, register } = useForm<DeleteUser>({
    defaultValues: {
      password: "",
    },
  });

  const deleteUserSubmit = async (data: DeleteUser) => {
    await dispatch(deleteUserThunk(data));
    dispatch(logoutThunk({ userId }));
  };

  return (
    <CommonModal open={open} onClose={onClose} modalTitle="회원탈퇴">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box component={"form"} onSubmit={handleSubmit(deleteUserSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Box
              sx={{
                display: "flex",
                gap: {
                  md: "1rem",
                },
                height: "inherit",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ width: "80%" }}>
                회원탈퇴를 진행하시겠습니까? 탈퇴시 데이터는 복구할 수 없습니다.
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <SimSimTextField
                      helperText={error?.message}
                      placeholder="패스워드를 입력해주세요."
                      size="small"
                      type="password"
                      sx={{ width: "100%", padding: 0 }}
                      {...register("password", {
                        required: "패스워드는 필수 입력 항목입니다.",
                      })}
                    />
                  );
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                type="submit"
                sx={{
                  backgroundColor: theme.palette.background.default,
                  width: { md: "2rem" },
                  color: theme.palette.error.dark,
                }}
              >
                탈퇴
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
}
