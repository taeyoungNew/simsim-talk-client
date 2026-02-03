import { createSlice } from "@reduxjs/toolkit";
import { getSuggestedUserInitThunk } from "./suggestedUserThunk";
import { followingCencelThunk, followingThunk } from "../follow/followThunk";
import { logout } from "../auth/authAction";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface UserInfo {
  userId: string;
  nickname: string;
  followerCnt: number;
  mutualFriendsCount: number;
  isFollowinged: boolean;
}

interface getSuggestedUser {
  isLoading: boolean;
  popularIsLoading: boolean;
  suggestedIsLoading: boolean;
  mutual: UserInfo[];
  popular: UserInfo[];
  error: null | Error;
}

const suggestedUserInitialState: getSuggestedUser = {
  isLoading: false,
  popularIsLoading: false,
  suggestedIsLoading: false,
  mutual: [],
  popular: [],
  error: null,
};

export const suggestedUserSlice = createSlice({
  name: "suggestedUser",
  initialState: suggestedUserInitialState,
  reducers: {},
  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => suggestedUserInitialState)
      .addCase(getSuggestedUserInitThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getSuggestedUserInitThunk.fulfilled, (state, action) => {
        state.mutual = action.payload.mutual;
        state.popular = action.payload.popular;
        state.isLoading = false;
      })
      .addCase(getSuggestedUserInitThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(followingThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(followingThunk.fulfilled, (state, action) => {
        const followId = action.payload.followId;
        state.popular.forEach((el, index) => {
          if (el.userId === followId) state.popular[index].isFollowinged = true;
        });
        state.mutual.forEach((el, index) => {
          if (el.userId === followId) state.mutual[index].isFollowinged = true;
        });
        state.isLoading = false;
      })
      .addCase(followingThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(followingCencelThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(followingCencelThunk.fulfilled, (state, action) => {
        const followId = action.payload.followId;
        state.popular.forEach((el, index) => {
          if (el.userId === followId)
            state.popular[index].isFollowinged = false;
        });
        state.mutual.forEach((el, index) => {
          if (el.userId === followId) state.mutual[index].isFollowinged = false;
        });
        state.isLoading = false;
      })
      .addCase(followingCencelThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
