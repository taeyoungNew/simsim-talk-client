import { createAsyncThunk } from "@reduxjs/toolkit";
import { createChatRoom, getChatListAPI } from "../../apis/chat";
import { joinChatRoom } from "../../sockets/chatSocket";
import { openSnackbar } from "../error/errorSlice";

type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface CreateChatReq {
  targetUserId: string;
  targetUserNickname: string;
}
interface CreateChatRes {
  createdAt: string;
  chatRoomId: string;
  targetUserId: string;
  targetUserNickname: string;
  targetUserEmail: string;
  isNew: boolean;
  isBlocked: boolean;
}
interface ChatRoomType {
  chatRoomId: string;
  targetUserId: string;
  targetUserEmail: string;
  targetUserNickname: string;
  lastMessagePreview: string;
  lastMessageType: MessageType;
  lastMessageAt: string;
  isBlocked: boolean;
}

interface GetChatListRes {
  chatList: ChatRoomType[];
}

export const getChatsThunk = createAsyncThunk<
  GetChatListRes,
  void,
  { rejectValue: Error }
>("chat/getChats", async (_, thunkAPI) => {
  try {
    const chatList = await getChatListAPI();

    return { chatList: chatList.data };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.data.status,
      message: error.response.data.message,
    });
  }
});

export const chatThunk = createAsyncThunk<
  CreateChatRes,
  CreateChatReq,
  { rejectValue: Error }
>(
  "chat/createChatRoom",
  async ({ targetUserId, targetUserNickname }, thunkAPI) => {
    try {
      const chatRoomResult = (await createChatRoom(targetUserId)).data;
      joinChatRoom(chatRoomResult.chatRoomId);
      return {
        createdAt: chatRoomResult.createdAt,
        targetUserEmail: chatRoomResult.targetUserEmail,
        targetUserNickname,
        targetUserId,
        chatRoomId: chatRoomResult.chatRoomId,
        isNew: chatRoomResult.isNew,
        isBlocked: chatRoomResult.isBlocked,
      };
    } catch (error: any) {
      const errMessage = error.response.data.message;
      thunkAPI.dispatch(openSnackbar(errMessage));

      return thunkAPI.rejectWithValue({
        errorCode: error.response.data.errorCode,
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  },
);
