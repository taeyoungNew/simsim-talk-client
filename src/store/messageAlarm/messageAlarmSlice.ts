import { createSlice } from "@reduxjs/toolkit";
import {
  addmessageAlarmThunk,
  clearalarmsByChatRoomThunk,
  getmessageAlarmThunk,
  markAlarmAsReadByRoomThunk,
} from "./messageAlarmThunk";
import { logout } from "../auth/authAction";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface messageAlarm {
  id: number;
  chatRoomId: string;
  senderId: string;
  senderNickname: string;
  content: string;
  contentType: "TEXT" | "FILE" | "SYSTEM" | "IMAGE";
  messageId: number;
  createdAt: string;
}

interface messageAlarmState {
  isLoading: boolean;
  alarmsByRoom: Record<string, messageAlarm[]>;
  error: null | Error;
}

const messageAlarmInitialState: messageAlarmState = {
  isLoading: false,
  alarmsByRoom: {},
  error: {
    status: 0,
    errorCode: "",
    message: "",
  },
};

export const messageAlarmSlice = createSlice({
  name: "messageAlarm",
  initialState: messageAlarmInitialState,
  reducers: {
    addmessageAlarms: (state, action) => {
      action.payload.forEach((alarm: any) => {
        const roomId = alarm.chatRoomId;

        if (!state.alarmsByRoom[roomId]) {
          state.alarmsByRoom[roomId] = [];
        }

        state.alarmsByRoom[roomId].push(alarm);
      });
    },
  },
  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => messageAlarmInitialState)
      .addCase(addmessageAlarmThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(addmessageAlarmThunk.fulfilled, (state, action) => {
        const {
          id,
          chatRoomId,
          content,
          contentType,
          createdAt,
          messageId,
          senderId,
          senderNickname,
        } = action.payload;
        if (!state.alarmsByRoom[chatRoomId]) {
          state.alarmsByRoom[chatRoomId] = [];
        }
        state.alarmsByRoom[chatRoomId].push({
          content: content,
          id: id,
          chatRoomId: chatRoomId,
          senderId: senderId,
          senderNickname: senderNickname,
          contentType: contentType,
          messageId: messageId,
          createdAt: createdAt,
        });
        state.isLoading = false;
      })
      .addCase(addmessageAlarmThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getmessageAlarmThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getmessageAlarmThunk.fulfilled, (state, action) => {
        const getAlarms = action.payload.getAlarms;

        if (getAlarms) {
          getAlarms.forEach((el) => {
            const roomId = el.chatRoomId;
            if (!state.alarmsByRoom[roomId]) {
              state.alarmsByRoom[roomId] = [];
            }
            state.alarmsByRoom[roomId].push({
              content: el.content,
              id: el.id,
              chatRoomId: el.chatRoomId,
              senderId: el.senderId,
              senderNickname: el.senderNickname,
              contentType: el.contentType,
              messageId: el.messageId,
              createdAt: el.createdAt,
            });
          });
        }

        state.isLoading = false;
      })
      .addCase(getmessageAlarmThunk.rejected, (state, _) => {
        state.isLoading = false;
      })

      .addCase(markAlarmAsReadByRoomThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(markAlarmAsReadByRoomThunk.fulfilled, (state, action) => {
        const chatRoomId = action.payload.chatRoomId;

        delete state.alarmsByRoom[chatRoomId];

        state.isLoading = false;
      })
      .addCase(markAlarmAsReadByRoomThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(clearalarmsByChatRoomThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(clearalarmsByChatRoomThunk.fulfilled, (state, action) => {
        const chatRoomId = action.payload.chatRoomId;

        delete state.alarmsByRoom[chatRoomId];

        state.isLoading = false;
      })
      .addCase(clearalarmsByChatRoomThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { addmessageAlarms } = messageAlarmSlice.actions;
export default messageAlarmSlice.reducer;
