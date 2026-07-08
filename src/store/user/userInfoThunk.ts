import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changeMyBackgroundImgAPI,
  changeMyProfileImgAPI,
  editMyInfo,
  myInfoAPI,
  userInfoAPI,
} from "../../apis/user";
import { loadingEnd, loadingStart } from "../loading/loadingSlice";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface UserInfo {
  profileUrl: string;
  backgroundUrl: string;
  username: string;
  aboutMe: string;
  age: number;
  nickname: string;
}

interface FollowInfo {
  profileUrl: string;
  nickname: string;
  username: string;
}

interface Followers {
  id: string;
  UserInfo: FollowInfo;
}

interface Followings {
  id: string;
  UserInfo: FollowInfo;
}

interface editMyInfoReq {
  aboutMe: string;
  age: number;
  targetId: string;
  username: string;
}

interface editMyInfoRes {
  aboutMe: string;
  age: number;
  username: string;
  message: string;
}

interface UserRes {
  id: string;
  profileUrl: string;
  backgroundUrl: string;
  blockStatus: boolean;
  email: string;
  isFollowinged: boolean;
  followerCnt: number;
  followingCnt: number;
  postCnt: number;
  UserInfo: UserInfo;
  Followers: Followers[];
  Followings: Followings[];
  isFollowingedIds: string[];
}

interface changeMyProfileImgReq {
  userId: string;
  file: File;
}
interface changeMyProfileImgRes {
  userId: string;
  profileUrl: string;
}

interface changeMyBackgroundImgReq {
  userId: string;
  file: File;
}
interface changeMyBackgroundImgRes {
  userId: string;
  backgroundUrl: string;
}

export const changeMyBackgroundImgThunk = createAsyncThunk<
  changeMyBackgroundImgRes,
  changeMyBackgroundImgReq,
  { rejectValue: Error }
>("user/changeMyBackgroundImg", async ({ userId, file }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const result = await changeMyBackgroundImgAPI(formData);
    return {
      userId,
      backgroundUrl: result.data.url,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});

export const changeMyProfileImgThunk = createAsyncThunk<
  changeMyProfileImgRes,
  changeMyProfileImgReq,
  { rejectValue: Error }
>("user/changeMyProfileImg", async ({ userId, file }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const result = await changeMyProfileImgAPI(formData);

    return {
      userId,
      profileUrl: result.data.url,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});

export const myInfoThunk = createAsyncThunk<
  UserRes,
  string,
  { rejectValue: Error }
>("user/myInfo", async (_, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const getMyInfo = await myInfoAPI();

    return getMyInfo.data.data;
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

export const userInfoThunk = createAsyncThunk<
  UserRes,
  string,
  { rejectValue: Error }
>("user/userInfo", async (userId, thunkAPI) => {
  thunkAPI.dispatch(loadingStart());
  try {
    const getUserInfoResult = await userInfoAPI(userId);
    const getUserInfo = getUserInfoResult.data.data;

    const payload: UserRes = {
      id: getUserInfo.id,
      profileUrl: getUserInfo.UserInfo.profileUrl,
      backgroundUrl: getUserInfo.UserInfo.backgroundUrl,
      email: getUserInfo.email,
      blockStatus: getUserInfo.blockStatus,
      isFollowinged: getUserInfo.isFollowinged,
      followerCnt: getUserInfo.followerCnt,
      followingCnt: getUserInfo.followingCnt,
      postCnt: getUserInfo.postCnt,
      UserInfo: getUserInfo.UserInfo,
      Followers: getUserInfo.Followers,
      Followings: getUserInfo.Followings,
      isFollowingedIds: getUserInfoResult.data.isFollowingedIds,
    };

    return payload;
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

export const editMyInfoThunk = createAsyncThunk<
  editMyInfoRes,
  editMyInfoReq,
  { rejectValue: Error }
>("user/editMyInfo", async (data, thunkAPI) => {
  try {
    const result = await editMyInfo(data);

    return {
      message: result.data.message,
      username: data.username,
      age: data.age,
      aboutMe: data.aboutMe,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});
