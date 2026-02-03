import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
import {
  getAlarmThunk,
  getAllAlarmByUserThunk,
  markAlarmThunk,
} from "./alarmThunk";
import { logout } from "../auth/authAction";

interface Error {
  status: number;
  errorCode: string;
  message: string;
}

interface Alarm {
  id: number;
  senderId: string;
  receiverId: string;
  senderNickname: string;
  targetId: number | string;
  targetType: "USER" | "POST" | "COMMENT" | "SYSTEM";
  alarmType: "FOLLOW" | "LIKE" | "COMMENT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

interface AlarmState {
  ids: number[];
  entities: Record<number, Alarm>;
  isLoading: boolean;
  error: null | Error;
}

const alarmInitialState: AlarmState = {
  isLoading: false,
  error: null,
  ids: [],
  entities: {},
};

export const alarmAdapter = createEntityAdapter<Alarm>({
  sortComparer: false,
});

export const alarmSlice = createSlice({
  name: "alarm",
  initialState: alarmInitialState,
  reducers: {},
  extraReducers: async (builder) => {
    builder
      .addCase(logout, (state, action) => alarmInitialState)
      .addCase(getAlarmThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getAlarmThunk.fulfilled, (state, action) => {
        const alarm = action.payload;

        state.entities[alarm.id] = alarm;

        if (!state.ids.includes(alarm.id)) {
          state.ids.unshift(alarm.id);
        }
        state.isLoading = false;
      })
      .addCase(getAlarmThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(markAlarmThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(markAlarmThunk.fulfilled, (state, action) => {
        const alarmId = action.payload.alarmId;

        state.entities[alarmId].isRead = true;
        state.isLoading = false;
      })
      .addCase(markAlarmThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getAllAlarmByUserThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getAllAlarmByUserThunk.fulfilled, (state, action) => {
        const alarmDatas = action.payload;

        if (!Array.isArray(alarmDatas)) return;
        alarmAdapter.setAll(state, alarmDatas);
        state.isLoading = false;
      })
      .addCase(getAllAlarmByUserThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default alarmSlice.reducer;
