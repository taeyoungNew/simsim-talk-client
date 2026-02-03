import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPostAPI, getPostsAPI } from "../../apis/post";
import { getAllPostsSlice } from "./allPostsSlice";
import { getUserPostsSlice } from "./userPostsSlice";
import { loadingEnd, loadingStart } from "../loading/loadingSlice";
import { openSnackbar } from "../error/errorSlice";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface IsLastIsLoading {
  isLoading: boolean;
  isLast: boolean;
}

interface Comment {
  id: number;
  postId: number;
  userId: string;
  userNickname: string;
  content: string;
  createAt: string;
}
interface Posts {
  id: number;
  profileUrl: string;
  userId: string;
  content: string;
  userNickname: string;
  likeCnt: number;
  isLiked: boolean;
  commentCnt: number;
  Comments: Comment[];
}

interface IsLikedPostIds {
  isLikedPostIds: isLikedPostId[];
}

interface isLikedPostId {
  postId: number;
}

interface GetPostsRes {
  posts: Posts[];
}

export const getPostsThunk = createAsyncThunk<
  GetPostsRes & IsLastIsLoading & IsLikedPostIds,
  number,
  {
    rejectValue: Error;
  }
>("post/getAllPosts", async (lastPostId, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const posts = await getPostsAPI(lastPostId);

    return posts.data;
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

export const createPostThunk = createAsyncThunk<
  Posts,
  string,
  {
    rejectValue: Error;
  }
>("post/createPost", async (content, thunkAPI) => {
  try {
    const newPost = (await createPostAPI(content)).data.data;

    thunkAPI.dispatch(getAllPostsSlice.actions.addPostToAllPosts(newPost));
    thunkAPI.dispatch(getUserPostsSlice.actions.addPostToUserPosts(newPost));
    return newPost;
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
