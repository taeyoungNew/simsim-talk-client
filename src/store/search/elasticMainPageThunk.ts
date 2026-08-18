import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchMainPageAPI } from "../../apis/elastic";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface search {
  keyword: string;
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
export const searchMainPage = createAsyncThunk<
  GetSearchMainPage,
  search,
  { rejectValue: Error }
>("search/mainPage", async ({ keyword }, thunkAPI) => {
  try {
    const result = (await searchMainPageAPI(keyword)).data.data;

    console.log("search result = ", result);

    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});
