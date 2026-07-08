import { createSlice } from "@reduxjs/toolkit";
import { getUserPostsThunk } from "./userPostsThunk";
import { deletePostThunk, modifyPostThunk } from "./postDetailThunk";
import { postLikeCencelThunk, postLikeThunk } from "../like/postLikeThunk";
import { logout } from "../auth/authAction";
import { createPostThunk } from "./allPostsThunk";

interface IsLastIsLoading {
  isLoading: boolean;
  isLast: boolean;
}
interface Error {
  status: number;
  errorCode: string;
  message: string;
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
  userId: string;
  userNickname: string;
  content: string;
  likeCnt: number;
  isLiked: boolean;
  commentCnt: number;
  Comments: Comment[];
}

interface getAllPostsSlice {
  posts: Post[];
  error: null | Error;
}

const getUserPostsInitialState: getAllPostsSlice & IsLastIsLoading = {
  isLoading: false,
  isLast: false,
  posts: [],
  error: {
    status: 0,
    errorCode: "",
    message: "",
  },
};

export const getUserPostsSlice = createSlice({
  name: "post/getUserPosts",
  initialState: getUserPostsInitialState,

  reducers: {
    addPostToUserPosts: (state, action) => {
      state.posts.unshift(action.payload);
    },
    resetIsLast: (state) => {
      state.isLast = false;
    },
    resetUserPosts: (state) => {
      state.posts = [];
    },
    updateUserPostCommentCnt: (state, action) => {
      const { postId, delta, role } = action.payload;
      if (role === "add") {
        const post = state.posts.find((p) => p.id === postId);
        if (post) post.commentCnt += delta;
      } else if (role === "remove") {
        const post = state.posts.find((p) => p.id === postId);
        if (post) post.commentCnt -= delta;
      }
    },
  },
  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => getUserPostsInitialState)
      .addCase(postLikeThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postLikeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const postId = action.payload.postId;
        for (let idx = 0; idx < state.posts.length; idx++) {
          if (state.posts[idx].id === postId) {
            state.posts[idx].likeCnt += 1;
            state.posts[idx].isLiked = true;
          }
        }
      })
      .addCase(postLikeThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(createPostThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.posts.unshift({
          ...action.payload,
          commentCnt: action.payload.Comments.length,
        });
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(postLikeCencelThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postLikeCencelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const postId = action.payload.postId;
        for (let idx = 0; idx < state.posts.length; idx++) {
          if (state.posts[idx].id === postId) {
            state.posts[idx].likeCnt -= 1;
            state.posts[idx].isLiked = false;
          }
        }
      })
      .addCase(postLikeCencelThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(getUserPostsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPostsThunk.fulfilled, (state, action) => {
        for (let idx = 0; idx < action.payload.posts.length; idx++) {
          state.posts.push({
            id: action.payload.posts[idx].id,
            userId: action.payload.posts[idx].userId,
            content: action.payload.posts[idx].content,
            userNickname: action.payload.posts[idx].userNickname,
            likeCnt: action.payload.posts[idx].likeCnt,
            isLiked: action.payload.posts[idx].isLiked,
            Comments: action.payload.posts[idx].Comments,
            commentCnt: action.payload.posts[idx].Comments.length,
          });
        }
        let likedSet: any;

        if (action.payload.isLikedPostIds !== undefined) {
          likedSet = new Set(
            action.payload.isLikedPostIds.map((item) => String(item.postId)),
          );
          state.posts.forEach((post) => {
            post.isLiked = likedSet.has(String(post.id));
          });
        }

        state.isLoading = false;
      })
      .addCase(getUserPostsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });

    builder
      .addCase(modifyPostThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(modifyPostThunk.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        for (let idx = 0; idx < state.posts.length; idx++) {
          if (state.posts[idx].id === updatedPost.id) {
            state.posts[idx] = updatedPost;
          }
        }
      })
      .addCase(modifyPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
    builder
      .addCase(deletePostThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter((el) => el.id !== postId);
        state.isLoading = false;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export const { updateUserPostCommentCnt, resetUserPosts, resetIsLast } =
  getUserPostsSlice.actions;
