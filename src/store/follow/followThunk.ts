import { createAsyncThunk } from "@reduxjs/toolkit";
import { followingAPI, followingCencelAPI } from "../../apis/follow";
import { RootState } from "..";
import { openSnackbar } from "../error/errorSlice";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface FollowingUserInfo {
  myId: string;
  followId: string;
  profileUrl: string;
  isMyPage: boolean;
  nickname: string;
  username: string;
  followingNickname: string;
}

interface FollowType {
  followId: string;
  followingNickname: string;
  isMyPage: boolean;
}

export const followingThunk = createAsyncThunk<
  FollowingUserInfo,
  FollowType,
  { rejectValue: Error }
>(
  "follow/following",
  async ({ followId, isMyPage, followingNickname }, thunkAPI) => {
    try {
      const followingUserInfo = (await followingAPI({ followId, isMyPage }))
        .data.data;

      const state: RootState = thunkAPI.getState() as RootState;
      const myId = state.User.id;
      return {
        myId,
        followId,
        profileUrl: followingUserInfo.profileUrl,
        isMyPage,
        followingNickname,
        nickname: followingUserInfo.nickname,
        username: followingUserInfo.username,
      };
    } catch (error: any) {
      const errMessage = error.response.data.message;
      thunkAPI.dispatch(openSnackbar(errMessage));
      return thunkAPI.rejectWithValue({
        errorCode: error.response.data.errorCode,
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  },
);

export const followingCencelThunk = createAsyncThunk<
  FollowingUserInfo,
  FollowType,
  { rejectValue: Error }
>(
  "follow/followingCencel",
  async ({ followId, isMyPage, followingNickname }, thunkAPI) => {
    try {
      const followingUserInfo = (
        await followingCencelAPI({ followId, isMyPage })
      ).data.data;
      const state: RootState = thunkAPI.getState() as RootState;
      const myId = state.User.id;
      return {
        myId,
        followId,
        isMyPage,
        followingNickname,
        profileUrl: followingUserInfo.profileUrl,
        nickname: followingUserInfo.nickname,
        username: followingUserInfo.username,
      };
    } catch (error: any) {
      const errMessage = error.response.data.message;
      thunkAPI.dispatch(openSnackbar(errMessage));
      return thunkAPI.rejectWithValue({
        errorCode: error.response.data.errorCode,
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  },
);
