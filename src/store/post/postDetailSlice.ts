import { createSlice } from "@reduxjs/toolkit";
import { getPostDetailThunk, modifyPostThunk } from "./postDetailThunk";
import {
  createCommentThunk,
  deleteCommentThunk,
  modifyCommentThunk,
} from "../comment/commentThunk";
import { postLikeCencelThunk, postLikeThunk } from "../like/postLikeThunk";
import { followingCencelThunk, followingThunk } from "../follow/followThunk";
import { logout } from "../auth/authAction";

interface IsLastIsLoading {
  isLoading: boolean;
  errorMessage: string | undefined;
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
  title: string;
  content: string;
  likeCnt: number;
  isLiked: boolean;
  isFollowinged: boolean;
  commentCnt: number;
  Comments: Comment[];
}

const postDetailInitialState: Post & IsLastIsLoading = {
  isLoading: false,
  errorMessage: "",
  id: 0,
  userId: "",
  userNickname: "",
  title: "",
  content: "",
  likeCnt: 0,
  isLiked: false,
  isFollowinged: false,
  commentCnt: 0,
  Comments: [],
};

export const getPostDetailSlice = createSlice({
  name: "post/getPostDetail",
  initialState: postDetailInitialState,
  reducers: {},

  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, _) => {
        state.isLiked = false;
        state.isFollowinged = false;
      })
      .addCase(getPostDetailThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPostDetailThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.isLoading = false;
        const postDetail = action.payload;
        state.id = postDetail.id;
        state.userId = postDetail.userId;
        state.title = postDetail.title;
        state.userNickname = postDetail.userNickname;
        state.content = postDetail.content;
        state.likeCnt = postDetail.likeCnt;
        state.isLiked = postDetail.isLiked;
        state.isFollowinged = postDetail.isFollowinged;
        state.commentCnt = postDetail.Comments.length;
        state.Comments = postDetail.Comments;
        state.isLoading = false;
      })
      .addCase(getPostDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });

    // 게시물
    builder
      .addCase(modifyPostThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(modifyPostThunk.fulfilled, (state, action) => {
        state.title = action.payload.title;
        state.content = action.payload.content;
        state.isLoading = false;
      })
      .addCase(modifyPostThunk.rejected, (state, action) => {
        state.isLoading = false;
      });

    // 게시물 좋아요
    builder
      .addCase(postLikeThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postLikeThunk.fulfilled, (state, action) => {
        state.likeCnt += 1;
        state.isLiked = true;
      })
      .addCase(postLikeThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    // 게시물 좋아요 취소
    builder
      .addCase(postLikeCencelThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postLikeCencelThunk.fulfilled, (state, action) => {
        state.likeCnt -= 1;
        state.isLiked = false;
      })
      .addCase(postLikeCencelThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    // 팔로잉
    builder
      .addCase(followingThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(followingThunk.fulfilled, (state, action) => {
        state.isFollowinged = true;
        state.isLoading = false;
      })
      .addCase(followingThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    // 팔로잉 취소
    builder
      .addCase(followingCencelThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(followingCencelThunk.fulfilled, (state, action) => {
        state.isFollowinged = false;
        state.isLoading = false;
      })
      .addCase(followingCencelThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
    // 댓글생성
    builder.addCase(createCommentThunk.fulfilled, (state, action) => {
      const newComment = action.payload;
      state.Comments.push(newComment);
      state.commentCnt = state.Comments.length;
    });
    // 댓글수정
    builder
      .addCase(modifyCommentThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(modifyCommentThunk.fulfilled, (state, action) => {
        const modifyComment = action.payload;
        for (let idx = 0; idx < state.Comments.length; idx++) {
          if (state.Comments[idx].id === modifyComment.id) {
            state.Comments[idx].content = modifyComment.content;
            break;
          }
        }
        state.isLoading = false;
      })
      .addCase(modifyCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });
    // 댓글삭제
    builder
      .addCase(deleteCommentThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        const deleteCommentId = action.payload.id;
        const Comments = state.Comments;
        const deleteComment = Comments.filter((el) => el.id != deleteCommentId);
        state.Comments = deleteComment;
        state.isLoading = false;
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });
  },
});
