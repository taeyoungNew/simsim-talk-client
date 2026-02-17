import { createSlice } from "@reduxjs/toolkit";
import { chatThunk, getChatsThunk } from "./chatThunk";
import { logout } from "../auth/authAction";

interface IsLastIsLoading {
  isLoading: boolean;
  errorMessage: string | undefined;
}
interface ChatRoomInfo {
  chatRoomId: string;
  targetUserNickname: string;
  targetUserId: string;
}

interface ChatListInfos {
  chatRoomId: string;
  targetUserId: string;
  targetUserEmail: string;
  targetUserNickname: string;
  lastMessagePreview: string;
  lastMessageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  lastMessageAt: string;
}
interface ChatInittialState {
  openedChatRooms: ChatRoomInfo[];
  activeChatRoomId: string | null;
  chatList: ChatListInfos[];
}

const chatInittialState: IsLastIsLoading & ChatInittialState = {
  isLoading: false,
  errorMessage: "",
  openedChatRooms: [],
  activeChatRoomId: null,
  chatList: [],
};
export const chatSlice = createSlice({
  name: "chat/chatRooms",
  initialState: chatInittialState,
  reducers: {
    updateChatList(state, action) {
      const { chatRoomId, createdAt, content, contentType } = action.payload;
      const room = state.chatList.find((el) => el.chatRoomId === chatRoomId);

      if (!room) return;

      room.lastMessageAt = createdAt;
      room.lastMessagePreview = content;
      room.lastMessageType = contentType;
    },
    deleteChatRoom(state, action) {
      const roomId = action.payload;
      state.openedChatRooms = state.openedChatRooms.filter(
        (el) => el.chatRoomId !== roomId,
      );

      if (state.activeChatRoomId === roomId) {
        state.activeChatRoomId = null;
      }
    },
  },

  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => chatInittialState)
      .addCase(getChatsThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getChatsThunk.fulfilled, (state, action) => {
        state.chatList = action.payload.chatList;

        state.isLoading = false;
      })
      .addCase(getChatsThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(chatThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(chatThunk.fulfilled, (state, action) => {
        const getChatRoomInfo = action.payload;

        const isOpendChatRoom = state.openedChatRooms.find(
          (el) => el.chatRoomId === getChatRoomInfo.chatRoomId,
        );

        if (!isOpendChatRoom) {
          state.openedChatRooms.push({
            targetUserNickname: getChatRoomInfo.targetUserNickname,
            chatRoomId: getChatRoomInfo.chatRoomId,
            targetUserId: getChatRoomInfo.targetUserId,
          });
        }

        // ✅ chatRoomList 선반영
        const existsInList = state.chatList.find(
          (el) => el.chatRoomId === getChatRoomInfo.chatRoomId,
        );

        if (!existsInList) {
          state.chatList.unshift({
            chatRoomId: getChatRoomInfo.chatRoomId,
            targetUserId: getChatRoomInfo.targetUserId,
            targetUserNickname: getChatRoomInfo.targetUserNickname,
            lastMessageAt: getChatRoomInfo.createdAt,
            lastMessagePreview: "",
            lastMessageType: "TEXT",
            targetUserEmail: getChatRoomInfo.targetUserEmail,
          });
        }
        state.activeChatRoomId = getChatRoomInfo.chatRoomId;
        state.isLoading = false;
      })
      .addCase(chatThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { deleteChatRoom, updateChatList } = chatSlice.actions;
export default chatSlice.reducer;
