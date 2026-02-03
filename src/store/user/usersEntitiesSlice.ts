import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { getPostsThunk } from "../post/allPostsThunk";
import {
  changeMyBackgroundImgThunk,
  changeMyProfileImgThunk,
  myInfoThunk,
  userInfoThunk,
} from "./userInfoThunk";
import { loginThunk } from "../auth/authThunk";
import { getSuggestedUserInitThunk } from "../suggestedUser/suggestedUserThunk";
import { logout } from "../auth/authAction";
interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface UserEntity {
  id: string;
  profileUrl: string;
  backgroundUrl: string;
}

interface UserEntityInitialState {
  isLoading: boolean;
  entities: Record<string, UserEntity>;
  error: null | Error;
}

const usersEntityInitialState: UserEntityInitialState = {
  isLoading: false,
  entities: {},
  error: {
    status: 0,
    errorCode: "",
    message: "",
  },
};

export const usersEntitiesSlice = createSlice({
  name: "userEntities",
  initialState: usersEntityInitialState,
  reducers: {
    upsertUser: (state, action) => {
      const user = action.payload;
      state.entities[user.id] = {
        ...state.entities[user.id],
        ...user,
      };
    },
    upsertUsers: (state, action) => {
      action.payload.forEach((user: WritableDraft<UserEntity>) => {
        state.entities[user.id] = {
          ...state.entities[user.id],
          ...user,
        };
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logout, (state, action) => usersEntityInitialState)
      .addCase(getSuggestedUserInitThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getSuggestedUserInitThunk.fulfilled, (state, action) => {
        const suggestedUsers = action.payload.mutual;
        const popularUsers = action.payload.popular;

        suggestedUsers.forEach((el) => {
          const userId = el.userId;
          const profileUrl = el.profileUrl;
          state.entities[userId] = {
            ...state.entities[userId],
            id: userId,
            profileUrl,
          };
        });

        popularUsers.forEach((el) => {
          const userId = el.userId;
          const profileUrl = el.profileUrl;
          state.entities[userId] = {
            ...state.entities[userId],
            id: userId,
            profileUrl,
          };
        });

        state.isLoading = false;
      })
      .addCase(getSuggestedUserInitThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(myInfoThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(myInfoThunk.fulfilled, (state, action) => {
        const userId = action.payload?.id;
        const profileUrl = action.payload?.UserInfo.profileUrl;
        const backgroundUrl = action.payload?.UserInfo.backgroundUrl;
        state.entities[userId] = {
          ...state.entities[userId],
          id: userId,
          profileUrl,
          backgroundUrl,
        };
        state.isLoading = false;
      })
      .addCase(myInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(userInfoThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userInfoThunk.fulfilled, (state, action) => {
        const userId = action.payload?.id;
        const profileUrl = action.payload?.profileUrl;
        const backgroundUrl = action.payload?.UserInfo.backgroundUrl;
        state.entities[userId] = {
          ...state.entities[userId],
          id: userId,
          profileUrl,
          backgroundUrl,
        };
        state.isLoading = false;
      })
      .addCase(userInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loginThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const userId = action.payload?.data.id;
        const profileUrl = action.payload?.data.profileUrl;
        state.entities[userId] = {
          ...state.entities[userId],
          id: userId,
          profileUrl,
        };
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getPostsThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPostsThunk.fulfilled, (state, action) => {
        const posts = action.payload.posts;
        posts.forEach((el) => {
          const userId = el.userId;
          const profileUrl = el.profileUrl;

          state.entities[userId] = {
            ...state.entities[userId],
            id: userId,
            profileUrl,
          };
        });
        state.isLoading = false;
      })
      .addCase(getPostsThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changeMyBackgroundImgThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(changeMyBackgroundImgThunk.fulfilled, (state, action) => {
        const userId = action.payload.userId;
        const backgroundUrl = action.payload.backgroundUrl;
        state.entities[userId] = {
          ...state.entities[userId],
          id: userId,
          backgroundUrl,
        };
        state.isLoading = false;
      })
      .addCase(changeMyBackgroundImgThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changeMyProfileImgThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(changeMyProfileImgThunk.fulfilled, (state, action) => {
        const userId = action.payload.userId;
        const profileUrl = action.payload.profileUrl;
        state.entities[userId] = {
          ...state.entities[userId],
          id: userId,
          profileUrl,
        };
        state.isLoading = false;
      })
      .addCase(changeMyProfileImgThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const { upsertUser, upsertUsers } = usersEntitiesSlice.actions;
export default usersEntitiesSlice.reducer;
