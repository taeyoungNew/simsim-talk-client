import { getSocket } from ".";
import { useAppDispatch } from "../store/hook";
import { clearMessageByRoom } from "../store/message/messageSlice";
import { messageThunk } from "../store/message/messageThunk";
import { AppDispatch } from "../store";
import { deleteChatRoom } from "../store/chat/chatSlice";

interface SendMessage {
  chatRoomId: string;
  content: string;
  targetUserId: string;
  originalName: string;
  contentType: "TEXT" | "FILE" | "SYSTEM" | "IMAGE";
}
interface ReceiveMessage {
  chatRoomId: string;
  content: string;
  originalName: string;
  contentType: "TEXT" | "FILE" | "SYSTEM" | "IMAGE";
  senderId: string;
}
export const leaveChatRoom = async (
  dispatch: AppDispatch,
  chatRoomId: string,
) => {
  const socket = getSocket();
  if (!socket?.connected) {
    socket?.connect();
  }
  socket?.emit("leaveChatRoom", { chatRoomId });
  dispatch(clearMessageByRoom(chatRoomId));
  dispatch(deleteChatRoom(chatRoomId));
};

export const receiveMessage = async (params: ReceiveMessage) => {
  const dispatch = useAppDispatch();
  await dispatch(messageThunk(params));
};

export const joinChatRoom = (chatRoomId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    socket?.connect();
  }

  socket?.emit("joinChatRoom", { chatRoomId });
};

export const sendMessageEvent = (props: SendMessage) => {
  const socket = getSocket();
  const chatRoomId = props.chatRoomId;
  const content = props.content;
  const targetUserId = props.targetUserId;
  const originalName = props.originalName;
  const contentType = props.contentType;
  if (!socket?.connected) {
    socket?.connect();
  }

  socket?.emit("sendMessage", {
    chatRoomId,
    originalName,
    targetUserId,
    content,
    contentType,
  });
};
