import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSuggestedUserAPI } from "../../apis/suggestedUser";
import { loadingEnd, loadingStart } from "../loading/loadingSlice";
interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface UserInfo {
  userId: string;
  nickname: string;
  profileUrl: string;
  followerCnt: number;
  mutualFriendsCount: number;
  isFollowinged: boolean;
}

interface getSuggestedUserReq {
  sectionType: "suggest" | "popular";
}

interface getSuggestedUserRes {
  mutual: UserInfo[];
  popular: UserInfo[];
}
export const getSuggestedUserInitThunk = createAsyncThunk<
  getSuggestedUserRes,
  void,
  { rejectValue: Error }
>("getSuggestedUser/init", async (_, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const result = await getSuggestedUserAPI();
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(loadingEnd());
  }
});

export const getSuggestedUsersMoreThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: Error }
>("getSuggestedUser/more", async () => {});

export const getPopularUsersMoreThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: Error }
>("getSuggestedUser/more", async () => {});
