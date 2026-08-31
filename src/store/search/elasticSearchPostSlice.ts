import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { globalSearchThunk } from "./elasticSearchThunk";

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

interface Post {
  id: number;
  profileUrl: string;
  userId: string;
  userNickname: string;
  content: string;
  likeCnt: number;
  isLiked: boolean;
  commentCnt: number;
  Comments: Comment[];
}

interface searchAllPostsSlice {
  searchPosts: Post[];
}

const elasticSearchPostsInitialState: searchAllPostsSlice & IsLastIsLoading = {
  searchPosts: [],
  isLoading: false,
  isLast: false,
};

export const elasticSearchPostsAdapter = createEntityAdapter<Post>({
  sortComparer: false,
});

export const elasticSearchPostsSlice = createSlice({
  name: "elasticSearch/posts",
  initialState: elasticSearchPostsInitialState,
  reducers: {
    resetSearchPosts: (state) => {
      state.searchPosts = [];
    },
  },
  extraReducers: async (builder) => {
    builder
      .addCase(globalSearchThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(globalSearchThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        console.log(action.payload.posts);

        for (let idx = 0; idx < action.payload.posts.length; idx++) {
          state.searchPosts.push({
            id: action.payload.posts[idx].id,
            profileUrl: action.payload.posts[idx].profileUrl,
            userId: action.payload.posts[idx].userId,
            userNickname: action.payload.posts[idx].userNickname,
            content: action.payload.posts[idx].content,
            likeCnt: action.payload.posts[idx].likeCnt,
            isLiked: false,
            Comments: action.payload.posts[idx].Comments,
            commentCnt: action.payload.posts[idx].commentCnt,
          });
        }
      })
      .addCase(globalSearchThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
