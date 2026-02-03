import { createSlice } from "@reduxjs/toolkit";
import { authMeThunk, loginThunk, logoutThunk } from "./authThunk";
import { changeMyProfileImgThunk } from "../user/userInfoThunk";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface UserInitialState {
  isLoading: boolean;
  isLogin: boolean;
  id: string;
  email: string;
  nickname: string;
  profileUrl: string;
  isLoginSuccess: boolean;
  error: null | Error;
  initialized: boolean;
}

const initialState: UserInitialState = {
  isLoading: false,
  isLogin: false,
  id: "",
  email: "",
  nickname: "",
  profileUrl: "",
  isLoginSuccess: false,
  initialized: false,
  error: {
    status: 0,
    errorCode: "",
    message: "",
  },
};

export const userSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.isLogin = false;
      (state.id = ""),
        (state.email = ""),
        (state.nickname = ""),
        (state.profileUrl = ""),
        (state.isLoginSuccess = false),
        (state.initialized = false);
    },
    resetUserError: (state) => {
      state.error = null;
    },
    resetIsLoginSuccess: (state) => {
      state.isLoginSuccess = false;
    },
    setAuth: (state, action) => {
      state.isLogin = true;
      state.id = action.payload.id;
      state.profileUrl = action.payload.profileUrl;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
    },

    deleteAuth: (state) => {
      state.isLogin = false;
      state.id = "";
      state.profileUrl = "";
      state.email = "";
      state.nickname = "";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isLoginSuccess = false;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLogin = true;
        state.isLoading = false;
        state.isLoginSuccess = true;
        state.id = action.payload?.data.id;
        state.profileUrl = action.payload?.data.profileUrl;
        state.email = action.payload?.data.email;
        state.nickname = action.payload?.data.nickname;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
    builder
      .addCase(logoutThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(changeMyProfileImgThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(changeMyProfileImgThunk.fulfilled, (state, action) => {
        state.profileUrl = action.payload.profileUrl;
        state.isLoading = false;
      })
      .addCase(changeMyProfileImgThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(authMeThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(authMeThunk.fulfilled, (state, action) => {
        state.isLogin = action.payload.isLogin;
        state.isLoading = false;
        state.isLoginSuccess = action.payload.isLogin;
        state.nickname = action.payload.user.nickname;
        state.email = action.payload.user.email;
        state.id = action.payload.user.id;
        state.profileUrl = action.payload.user.profileUrl;
        state.initialized = true;
      })
      .addCase(authMeThunk.rejected, (state, action) => {
        state.error = action.payload as Error;
        state.isLoading = false;
        state.isLogin = false;
        state.isLoginSuccess = false;
        state.nickname = "";
        state.email = "";
        state.id = "";
        state.initialized = true;
      });
  },
});

export const { resetUserError, setAuth, deleteAuth, resetIsLoginSuccess } =
  userSlice.actions;
