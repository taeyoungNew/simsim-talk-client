import { createAsyncThunk } from "@reduxjs/toolkit";
import { authMeAPI, loginAPI, logoutAPI } from "../../apis/auth";
import {
  authenticatSocket,
  loginSocket,
  logoutSocket,
} from "../../sockets/authSocket";
import { getMsgAlarmsSocket } from "../../sockets/alarmSocket";
import { deleteAuth } from "./authSlice";
import { resetLiked } from "../post/allPostsSlice";
import { loadingStart, loadingEnd } from "../loading/loadingSlice";
import { reconnectSocket } from "../../sockets";

interface LoginReq {
  email: string;
  password: string;
}

interface AuthMeRes {
  isLogin: boolean;
  user: {
    id: string;
    profileUrl: string;
    email: string;
    nickname: string;
  };
}

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

export const loginThunk = createAsyncThunk<
  {
    data: {
      id: string;
      profileUrl: string;
      email: string;
      nickname: string;
    };
    message: string;
  },
  LoginReq,
  {
    rejectValue: Error;
  }
>("auth/login", async ({ email, password }, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const loginResult = await loginAPI({
      email,
      password,
    });
    thunkAPI.dispatch(resetLiked());
    const userId: string = loginResult.data.data.id;
    reconnectSocket(userId);
    getMsgAlarmsSocket();
    return { message: loginResult.data.message, data: loginResult.data.data };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(loadingEnd());
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  { userId: string },
  { rejectValue: Error }
>("auth/logout", async ({ userId }, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const res = await logoutAPI();
    thunkAPI.dispatch(resetLiked());
    thunkAPI.dispatch(deleteAuth());
    logoutSocket(userId);
    alert(res.data.message);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(loadingEnd());
  }
});

export const authMeThunk = createAsyncThunk<
  AuthMeRes,
  void,
  { rejectValue: Error }
>("auth/auth-me", async (_, thunkAPI) => {
  try {
    const res = await authMeAPI();

    return {
      isLogin: res.data.isLogin,
      user: {
        id: res.data.user.id,
        profileUrl: res.data.user.profileUrl,
        email: res.data.user.email,
        nickname: res.data.user.nickname,
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});
