import { createSlice } from "@reduxjs/toolkit";
import {
  changeMyProfileImgThunk,
  editMyInfoThunk,
  myInfoThunk,
  userInfoThunk,
} from "./userInfoThunk";
import { followingCencelThunk, followingThunk } from "../follow/followThunk";
import { logout } from "../auth/authAction";
import {
  blockByMeUserListThunk,
  blockUserThunk,
  unBlockUserThunk,
} from "../blocked/blockThunk";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface Followers {
  id: string;
  profileUrl: string;
  nickname: string;
  username: string;
  isFollowing: boolean;
}

interface Followings {
  id: string;
  profileUrl: string;
  nickname: string;
  username: string;
  isFollowing: boolean;
}

interface BlockUser {
  id: string;
  profileUrl: string;
  createAt: string;
}

interface IsFollowingedId {
  isFollowingedId: string;
}

interface UserInfoInitialState {
  isLoading: boolean;
  success: boolean;
  successMessage: string;
  id?: string;
  profileUrl: string;
  blockStatus: boolean;
  nickname: string;
  username: string;
  aboutMe: string;
  age: number;
  followerCnt: number;
  followingCnt: number;
  followers: Followers[];
  followings: Followings[];
  isFollowinged?: boolean;
  isFollowingedIds: string[];
  postCnt: number;
  error: null | Error;
  blockUserList: BlockUser[];
}

const userInfoInitialState: UserInfoInitialState = {
  isLoading: false,
  success: false,
  successMessage: "",
  id: "",
  nickname: "",
  username: "",
  blockStatus: false,
  aboutMe: "",
  age: 0,
  followerCnt: 0,
  followingCnt: 0,
  isFollowinged: false,
  postCnt: 0,
  error: {
    status: 0,
    errorCode: "",
    message: "",
  },
  followers: [],
  followings: [],
  isFollowingedIds: [],
  profileUrl: "",
  blockUserList: [],
};

export const userInfoSlice = createSlice({
  name: "user/myInfo",
  initialState: userInfoInitialState,
  reducers: {
    resetEditMyInfoError: (state) => {
      state.error = null;
    },
    resetInitMyInfo: (state) => {
      state.success = false;
      state.successMessage = "";
      state.error = null;
    },
    resetFollowings: (state) => {
      state.followings = [];
    },
    resetFollowers: (state) => {
      state.followers = [];
    },
  },

  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => userInfoInitialState)
      .addCase(myInfoThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(myInfoThunk.fulfilled, (state, action) => {
        state.profileUrl = action.payload?.UserInfo.profileUrl;
        state.nickname = action.payload?.UserInfo.nickname;
        state.username = action.payload?.UserInfo.username;
        state.aboutMe = action.payload?.UserInfo.aboutMe;
        state.age = action.payload?.UserInfo.age;
        state.followerCnt = action.payload?.followerCnt;
        state.followingCnt = action.payload?.followingCnt;
        state.postCnt = action.payload?.postCnt;
        state.isLoading = false;

        for (let idx = 0; idx < action.payload?.Followers.length; idx++) {
          state.followers.push({
            id: action.payload.Followers[idx].id,
            profileUrl: action.payload.Followers[idx].UserInfo.profileUrl,
            nickname: action.payload.Followers[idx].UserInfo.nickname,
            username: action.payload.Followers[idx].UserInfo.username,
            isFollowing: false,
          });
        }
        let isFollowingSet: any;
        if (action.payload.Followings.length !== 0) {
          for (let idx = 0; idx < action.payload.Followings.length; idx++) {
            state.isFollowingedIds.push(action.payload.Followings[idx].id);
          }

          isFollowingSet = new Set(
            state.isFollowingedIds.map((item) => String(item)),
          );

          state.followers.forEach((el) => {
            if (isFollowingSet.has(el.id)) el.isFollowing = true;
          });
        }
        for (let idx = 0; idx < action.payload?.Followings.length; idx++) {
          state.followings.push({
            id: action.payload.Followings[idx].id,
            profileUrl: action.payload.Followings[idx].UserInfo.profileUrl,
            nickname: action.payload.Followings[idx].UserInfo.nickname,
            username: action.payload.Followings[idx].UserInfo.username,
            isFollowing: true,
          });
        }
      })
      .addCase(myInfoThunk.rejected, (state, action) => {
        state.error = action.payload as Error;
        state.isLoading = false;
      });
    // 팔로잉
    builder
      .addCase(followingThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(followingThunk.fulfilled, (state, action) => {
        const userId = action.payload.followId;
        const followingsList = state.followings;
        const followerList = state.followers;
        // 나의 페이지에 접속할경우 팔로잉 팔로워리스트를 추가
        if (action.payload.isMyPage) {
          state.followingCnt += 1;
          // 만약 내가 팔로잉한사람이 팔로워리스트에있다면 버튼을 바꿔줘야함
          state.followers.forEach((el, index) => {
            if (el.id === userId) {
              state.followers[index].isFollowing = true;
            }
          });
          // 팔로잉대상이 아직 store에 남아있다면
          // 해당 유저의 isFollowing만 true로 변경
          state.followings.forEach((el, index) => {
            if (el.id === userId) {
              state.followings[index].isFollowing = true;
            }
          });
          // 팔로잉대상이 store에 존재하지않는다면
          // 새롭게 store에 추가
          if (!followingsList.some((el) => el.id === action.payload.followId)) {
            state.followings.push({
              id: action.payload.followId,
              profileUrl: action.payload.profileUrl,
              nickname: action.payload.nickname,
              username: action.payload.username,
              isFollowing: true,
            });
          }
        } else {
          if (state.id === action.payload.followId) {
            state.isFollowinged = true;
            // 타유저페이지에서 해당페이지유저를 팔로잉 했을때만 카운트와 팔로워리스트에 '나'를 추가한다.
            state.followerCnt += 1;

            if (!followerList.some((el) => el.id === action.payload.myId)) {
              state.followers.push({
                id: action.payload.myId,
                profileUrl: action.payload.profileUrl,
                nickname: action.payload.nickname,
                username: action.payload.username,
                isFollowing: false,
              });
            }
          } else {
            // 타유저페이지에서 타유저의 팔로워나 팔로잉을 팔로잉 팔로잉취소를 했을경우
            // 버튼만 변경한다.
            state.isFollowingedIds.push(action.payload.followId);

            const isFollowingedIdsSet = new Set(
              state.isFollowingedIds.map((el) => el),
            );

            state.followers.forEach((el) => {
              if (isFollowingedIdsSet.has(el.id)) el.isFollowing = true;
            });
            state.followings.forEach((el) => {
              if (isFollowingedIdsSet.has(el.id)) el.isFollowing = true;
            });
          }
        }
        state.isLoading = false;
      })
      .addCase(followingThunk.rejected, (state) => {
        state.isLoading = false;
      });
    // 팔로잉 취소
    builder
      .addCase(followingCencelThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(followingCencelThunk.fulfilled, (state, action) => {
        const userId = action.payload.followId;
        const myId = action.payload.myId;

        if (action.payload.isMyPage) {
          state.followingCnt -= 1;
          state.followers.forEach((el, index) => {
            if (el.id === userId) {
              state.followers[index].isFollowing = false;
            }
          });
          state.followings.forEach((el, index) => {
            if (el.id === userId) {
              state.followings[index].isFollowing = false;
            }
          });
        } else {
          // 타유저페이지에서 해당페이지유저를 팔로잉취소 했을때만 카운트와 팔로워리스트에 '나'를 지운다.
          if (state.id === action.payload.followId) {
            state.followerCnt -= 1;
            state.followers = state.followers.filter((el) => el.id !== myId);
            state.isFollowinged = false;
          } else {
            // 타유저페이지에서 타유저의 팔로워나 팔로잉을 팔로잉 팔로잉취소를 했을경우
            // 버튼만 변경한다.
            state.isFollowingedIds = state.isFollowingedIds.filter(
              (el) => el !== action.payload.followId,
            );
            state.followers.forEach((el) => {
              if (el.id === action.payload.followId) el.isFollowing = false;
            });
            state.followings.forEach((el) => {
              if (el.id === action.payload.followId) el.isFollowing = false;
            });
          }
        }
        state.isLoading = false;
      })
      .addCase(followingCencelThunk.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(changeMyProfileImgThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(changeMyProfileImgThunk.fulfilled, (state, action) => {
        const profileUrl = action.payload.profileUrl;
        state.profileUrl = profileUrl;

        state.isLoading = false;
      })
      .addCase(changeMyProfileImgThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    // 차단 차단해제 차단리스트가져오기
    builder
      .addCase(blockUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        const myId = action.payload.data.myId;
        const blockedId = action.payload.data.blockedId;
        state.isLoading = false;
        state.isFollowinged = false;
        state.blockStatus = true;
        const isFollowing = state.followers.find((el) => el.id === myId);
        if (state.id === blockedId) {
          if (isFollowing) {
            state.followerCnt -= 1;
            state.followers = state.followers.filter((el) => el.id !== myId);
            state.isFollowinged = false;
          }
        } else {
          // 타유저페이지에서 타유저의 팔로워나 팔로잉을 팔로잉 팔로잉취소를 했을경우
          // 버튼만 변경한다.
          state.isFollowingedIds = state.isFollowingedIds.filter(
            (el) => el !== blockedId,
          );
          state.followers.forEach((el) => {
            if (el.id === blockedId) el.isFollowing = false;
          });
          state.followings.forEach((el) => {
            if (el.id === blockedId) el.isFollowing = false;
          });
        }
      })
      .addCase(blockUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      .addCase(unBlockUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unBlockUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.blockStatus = false;
      })
      .addCase(unBlockUserThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload as Error;
      });
    // .addCase(blockByMeUserListThunk.pending, (state, action) => {})
    // .addCase(blockByMeUserListThunk.fulfilled, (state, action) => {
    //   state.blockUserList = action.payload;
    // })
    // .addCase(blockByMeUserListThunk.rejected, (state, action) => {
    //   state.isLoading = false;

    //   state.error = action.payload as Error;
    // });
    // 타유저의 정보가져오기
    builder
      .addCase(userInfoThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userInfoThunk.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.profileUrl = action.payload?.UserInfo.profileUrl;
        state.nickname = action.payload?.UserInfo.nickname;
        state.username = action.payload?.UserInfo.username;
        state.aboutMe = action.payload?.UserInfo.aboutMe;
        state.age = action.payload?.UserInfo.age;
        state.isFollowinged = action.payload?.isFollowinged;
        state.followerCnt = action.payload.followerCnt;
        state.followingCnt = action.payload.followingCnt;
        state.postCnt = action.payload?.postCnt;
        state.blockStatus = action.payload?.blockStatus;

        for (let idx = 0; idx < action.payload?.Followers.length; idx++) {
          state.followers.push({
            id: action.payload.Followers[idx].id,
            profileUrl: action.payload.Followers[idx].UserInfo.profileUrl,
            nickname: action.payload.Followers[idx].UserInfo.nickname,
            username: action.payload.Followers[idx].UserInfo.username,
            isFollowing: false,
          });
        }

        for (let idx = 0; idx < action.payload?.Followings.length; idx++) {
          state.followings.push({
            id: action.payload.Followings[idx].id,
            profileUrl: action.payload.Followings[idx].UserInfo.profileUrl,
            nickname: action.payload.Followings[idx].UserInfo.nickname,
            username: action.payload.Followings[idx].UserInfo.username,
            isFollowing: false,
          });
        }
        if (action.payload.isFollowingedIds?.length > 0) {
          const isFollowingedIdsSet = new Set(
            action.payload.isFollowingedIds.map((el) => String(el)),
          );
          state.isFollowingedIds = action.payload.isFollowingedIds.map((el) =>
            String(el),
          );
          state.followers.forEach((el) => {
            if (isFollowingedIdsSet.has(el.id)) {
              el.isFollowing = true;
            }
          });
          state.followings.forEach((el) => {
            if (isFollowingedIdsSet.has(el.id)) {
              el.isFollowing = true;
            }
          });
        }
        state.isLoading = false;
      })
      .addCase(userInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
    builder
      .addCase(editMyInfoThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editMyInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.successMessage = action.payload.message;
        state.username = action.payload?.username;
        state.aboutMe = action.payload?.aboutMe;
        state.age = action.payload?.age;
      })
      .addCase(editMyInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export const {
  resetEditMyInfoError,
  resetInitMyInfo,
  resetFollowings,
  resetFollowers,
} = userInfoSlice.actions;
export default userInfoSlice.reducer;
