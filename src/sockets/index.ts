import { io, Socket } from "socket.io-client";
import { setOnlineUsers } from "../store/onlineUsers/onlineUsersSlice";
import { AppDispatch } from "../store";
import { addMessage, setMessagesByRoom } from "../store/message/messageSlice";
import {
  addmessageAlarmThunk,
  clearalarmsByChatRoomThunk,
  getmessageAlarmThunk,
} from "../store/messageAlarm/messageAlarmThunk";
import { getMsgAlarmsSocket } from "./alarmSocket";
import { updateChatList } from "../store/chat/chatSlice";
import { loginSocket } from "./authSocket";
import { getAlarmThunk } from "../store/alarm/alarmThunk";

let socket: Socket | null = null;

export const getSocket = () => socket;

export const initSocket = (dispatch: AppDispatch) => {
  console.log(
    "import.meta.env.VITE_SOCKET_BASE = ",
    import.meta.env.VITE_SOCKET_BASE,
  );

  if (!socket) {
    socket = io(`${import.meta.env.VITE_SOCKET_BASE}`, {
      withCredentials: true,
    });
  }

  socket.on("connection", (msg) => {
    console.log("initSocket");
    console.log(msg);
  });
  socket.on("socketReady", () => {
    console.log("socket ready!");
  });
  // 현재 로그인중인 유저의 리스트를 받기
  socket.on("onlineUsers", (params) => {
    dispatch(setOnlineUsers(params));
  });

  socket.on("receiveMessage", async (params) => {
    dispatch(addMessage(params));
    dispatch(updateChatList(params));
  });
  socket.on("chatHistory", async (params) => {
    dispatch(setMessagesByRoom(params));
  });
  socket.on("socketAuthenticated", async () => {
    getMsgAlarmsSocket();
  });
  socket.on("emitAlarms", async (params) => {
    console.log("emitAlarms event = ", params);

    dispatch(getmessageAlarmThunk(params));
  });
  socket.on("msgAlarmsRead", async (param) => {
    dispatch(clearalarmsByChatRoomThunk(param));
  });
  socket.on("notifyMessageAlarm", async (params) => {
    dispatch(addmessageAlarmThunk(params));
    dispatch(updateChatList(params));
  });
  socket.on("sendAlarm", async (params) => {
    dispatch(getAlarmThunk(params));
  });
  return socket;
};
export const reconnectSocket = (userId: string) => {
  if (socket) {
    socket.disconnect();
  }
  socket?.connect();

  socket?.once("connect", () => {
    loginSocket(userId);
  });
};
