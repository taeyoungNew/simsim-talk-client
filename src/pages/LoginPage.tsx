import { Box, Button, Grid2 } from "@mui/material";
import { ChatQuote } from "../assets/icons/ChatQuote";
import "../assets/style/loginPage.css";
import { theme } from "../theme/theme";
import { SimSimTextField } from "../components/atoms/inputs/SimsimTextField";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../store/hook";
import { loginThunk } from "../store/auth/authThunk";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ErrNotificationBar } from "../components/atoms/notifications/ErrNotificationBar";
import { resetLiked, resetPosts } from "../store/post/allPostsSlice";
import {
  getFollowingsThunk,
  getFriendsThunk,
} from "../store/userRelation/userRelationThunk";
import { getChatsThunk } from "../store/chat/chatThunk";
import { getAllAlarmByUserThunk } from "../store/alarm/alarmThunk";
import { getPostsThunk, refreshPostsThunk } from "../store/post/allPostsThunk";

type LoginType = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const isLoginSuccess = useSelector(
    (state: RootState) => state.User.isLoginSuccess,
  );
  const isLoginError = useSelector((state: RootState) => state.User.error);
  const loginErrMsg = useSelector(
    (state: RootState) => state.User.error?.message,
  );

  const { handleSubmit, control, register } = useForm<LoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const login = async (data: LoginType) => {
    dispatch(resetLiked());
    dispatch(resetPosts());

    await dispatch(loginThunk(data));
    await dispatch(getFollowingsThunk());
    await dispatch(getFriendsThunk());
    await dispatch(getChatsThunk());
    await dispatch(getAllAlarmByUserThunk());
    if (isLoginSuccess) await dispatch(refreshPostsThunk());
  };
  return (
    <>
      <Box
        component={"form"}
        sx={{ display: "flex", justifyContent: "center", marginTop: "0.5em" }}
        onSubmit={handleSubmit(login)}
      >
        <Grid2
          sx={{ paddingTop: "30px" }}
          direction="column"
          container
          rowSpacing={5}
        >
          <Grid2
            width={350}
            size={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ChatQuote
              color={theme.palette.primary.contrastText}
              size={100}
            ></ChatQuote>
          </Grid2>

          {isLoginError !== undefined &&
          isLoginError?.errorCode !== "" &&
          isLoginError !== null ? (
            <ErrNotificationBar errorMessage={loginErrMsg}></ErrNotificationBar>
          ) : (
            <Box></Box>
          )}

          <Grid2 sx={{ width: "100%", paddingTop: "1em" }} flexGrow={1}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <SimSimTextField
                    helperText={error?.message}
                    {...field}
                    autoComplete="username"
                    id="outlined-basic"
                    label="email"
                    variant="outlined"
                    sx={{
                      width: "inherit",
                      color: (theme) => theme.palette.fontColor.main,
                    }}
                    size="small"
                    placeholder="email@example.com"
                    {...register("email", {
                      required: "이메일은 필수 입력 항목입니다.",
                      pattern: {
                        value:
                          /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                        message: "이메일 형식이 올바르지 않습니다.",
                      },
                    })}
                  />
                );
              }}
            />
          </Grid2>
          <Grid2 sx={{ width: "100%" }} flexGrow={1}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <SimSimTextField
                    autoComplete="current-password"
                    helperText={error?.message}
                    {...field}
                    id="outlined-password-input"
                    label="password"
                    variant="outlined"
                    placeholder="password"
                    type="password"
                    sx={{ width: "inherit", height: "inherit" }}
                    size="small"
                    {...register("password", {
                      required: "패스워드는 필수 입력 항목입니다.",
                    })}
                  ></SimSimTextField>
                );
              }}
            />
          </Grid2>

          <Grid2 sx={{ width: "100%" }} flexGrow={1}>
            <Button
              variant="contained"
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
                backgroundColor: (theme) => theme.palette.primary.dark,
                width: "inherit",
                height: "40px",
                fontSize: "10px",
              }}
              type="submit"
            >
              로그인
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};
