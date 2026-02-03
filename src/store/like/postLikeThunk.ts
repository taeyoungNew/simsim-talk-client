import { createAsyncThunk } from "@reduxjs/toolkit";
import { postLikeAPI, postLikeCencelAPI } from "../../apis/like";
import { openSnackbar } from "../error/errorSlice";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

export const postLikeThunk = createAsyncThunk<
  { postId: number },
  number,
  { rejectValue: Error }
>("like/post", async (postId, thunkAPI) => {
  try {
    await postLikeAPI(postId);
    return { postId: postId };
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

export const postLikeCencelThunk = createAsyncThunk<
  { postId: number },
  number,
  { rejectValue: Error }
>("likecencel/post", async (postId, thunkAPI) => {
  try {
    await postLikeCencelAPI(postId);
    return { postId: postId };
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
