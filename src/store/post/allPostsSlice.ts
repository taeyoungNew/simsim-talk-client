import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createPostThunk, getPostsThunk } from "./allPostsThunk";
import { deletePostThunk, modifyPostThunk } from "./postDetailThunk";

import { postLikeCencelThunk, postLikeThunk } from "../like/postLikeThunk";

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

interface getAllPostsSlice {
  posts: Post[];
}

const getAllPostsInitialState: getAllPostsSlice & IsLastIsLoading = {
  posts: [],
  isLoading: false,
  isLast: false,
};

export const getAllPostsAdapter = createEntityAdapter<Post>({
  sortComparer: false,
});

export const getAllPostsSlice = createSlice({
  name: "post/getAllPosts",
  initialState: getAllPostsInitialState,

  reducers: {
    resetPosts: (state) => {
      state.posts = [];
    },
    setPosts: (state, action) => {
      const posts: Post[] = action.payload.posts;
      for (let idx = 0; idx < posts.length; idx++) {
        state.posts[idx] = posts[idx];
      }
    },
    resetLiked: (state) => {
      state.posts.forEach((post) => {
        post.isLiked = false;
      });
    },
    addPostToAllPosts: (state, action) => {
      // console.log("addPostToAllPosts = ", action.payload);
      // state.posts.unshift(
      //   { commentCnt: action.payload.Comments.length },
      //   ...action.payload,
      // );
      // state.posts.unshift(action.payload);
    },
    updatePostCommentCnt: (state, action) => {
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
      .addCase(getPostsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        for (let idx = 0; idx < action.payload.posts.length; idx++) {
          state.posts.push({
            id: action.payload.posts[idx].id,
            profileUrl: action.payload.posts[idx].profileUrl,
            userId: action.payload.posts[idx].userId,
            content: action.payload.posts[idx].content,
            userNickname: action.payload.posts[idx].userNickname,
            likeCnt: action.payload.posts[idx].likeCnt,
            isLiked: false,
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
      .addCase(getPostsThunk.rejected, (state, action) => {
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
      });

    builder
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
  },
});

export const { updatePostCommentCnt, resetLiked, resetPosts } =
  getAllPostsSlice.actions;
