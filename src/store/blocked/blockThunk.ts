import { createAsyncThunk } from "@reduxjs/toolkit";
import { openSnackbar } from "../error/errorSlice";
import {
  blockByMeUserListAPI,
  blockUserAPI,
  unBlockUserAPI,
} from "../../apis/blockUser";

interface BlockUserType {
  blockUserId: string;
}

interface UnBlockUserType {
  unBlockUserId: string;
}

interface BlockByMeUserList {
  userId: string;
}

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

export const blockUserThunk = createAsyncThunk<
  { message: string; data: { blockedId: string; myId: string } },
  BlockUserType,
  { rejectValue: Error }
>("block/blockUser", async ({ blockUserId }, thunkAPI) => {
  try {
    const blockUserResult = (await blockUserAPI({ blockUserId })).data;

    return blockUserResult;
  } catch (error: any) {
    const errMessage = error.response.data.message;
    thunkAPI.dispatch(openSnackbar(errMessage));
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});

export const unBlockUserThunk = createAsyncThunk<
  { message: string },
  UnBlockUserType,
  { rejectValue: Error }
>("block/unBlockUser", async ({ unBlockUserId }: UnBlockUserType, thunkAPI) => {
  try {
    const unBlockUserResult = (await unBlockUserAPI({ unBlockUserId })).data
      .data;
    return unBlockUserResult;
  } catch (error: any) {
    const errMessage = error.response.data.message;
    thunkAPI.dispatch(openSnackbar(errMessage));
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});

export const blockByMeUserListThunk = createAsyncThunk<
  {},
  BlockByMeUserList,
  { rejectValue: Error }
>("block/blockByMeUserList", async ({}, thunkAPI) => {
  try {
    return (await blockByMeUserListAPI()).data.data;
  } catch (error: any) {
    const errMessage = error.response.data.message;
    thunkAPI.dispatch(openSnackbar(errMessage));
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});
