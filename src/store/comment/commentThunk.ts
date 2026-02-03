import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCommentAPI,
  deleteCommentAPI,
  modifyCommentAPI,
} from "../../apis/comment";
import { updatePostCommentCnt } from "../post/allPostsSlice";
import { updateUserPostCommentCnt } from "../post/userPostsSlice";
import { openSnackbar } from "../error/errorSlice";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface CreateComment {
  postId: number;
  comment: string;
}

interface ReturnComment {
  id: number;
  postId: number;
  userId: string;
  userNickname: string;
  content: string;
  createAt: string;
}

interface ModifyComment {
  id: number;
  postId: number;
  content: string;
}

interface DeleteComment {
  id: number;
  postId: number;
}

export const createCommentThunk = createAsyncThunk<
  ReturnComment,
  CreateComment,
  {
    rejectValue: Error;
  }
>("comment/createComment", async (payload, thunkAPI) => {
  try {
    const result = (await createCommentAPI(payload)).data.plainComment;

    thunkAPI.dispatch(
      updatePostCommentCnt({ postId: payload.postId, delta: 1, role: "add" }),
    );
    thunkAPI.dispatch(
      updateUserPostCommentCnt({
        postId: payload.postId,
        delta: 1,
        role: "add",
      }),
    );
    return result;
  } catch (error: any) {
    const errMessage = error.response.data.message;
    thunkAPI.dispatch(openSnackbar(errMessage));
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});

export const modifyCommentThunk = createAsyncThunk<
  ReturnComment,
  ModifyComment,
  {
    rejectValue: Error;
  }
>("comment/modifyComment", async (data, thunkAPI) => {
  try {
    const result = (await modifyCommentAPI(data)).data.data.comment;
    return result;
  } catch (error: any) {
    const errMessage = error.response.data.message;
    thunkAPI.dispatch(openSnackbar(errMessage));
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});

export const deleteCommentThunk = createAsyncThunk<
  DeleteComment,
  DeleteComment,
  { rejectValue: Error }
>("comment/deleteComment", async (payload, thunkAPI) => {
  try {
    await deleteCommentAPI(payload);
    thunkAPI.dispatch(
      updatePostCommentCnt({
        postId: payload.postId,
        delta: 1,
        role: "remove",
      }),
    );
    thunkAPI.dispatch(
      updateUserPostCommentCnt({
        postId: payload.postId,
        delta: 1,
        role: "remove",
      }),
    );
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});
