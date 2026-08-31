import { createAsyncThunk } from "@reduxjs/toolkit";
import { globalSearchAPI } from "../../apis/elastic";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface search {
  keyword: string;
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

interface GetSearchMainPage {
  posts: Posts[];
}
export const globalSearchThunk = createAsyncThunk<
  GetSearchMainPage,
  search,
  { rejectValue: Error }
>("search/mainPage", async ({ keyword }, thunkAPI) => {
  try {
    const result = (await globalSearchAPI(keyword)).data.data.posts;

    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});
