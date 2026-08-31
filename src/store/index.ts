import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./auth/authSlice";
import { getAllPostsSlice } from "./post/allPostsSlice";
import { getPostDetailSlice } from "./post/postDetailSlice";
import { signupSlice } from "./user/userSlice";
import { getUserPostsSlice } from "./post/userPostsSlice";
import { userInfoSlice } from "./user/userInfoSlice";
import { onlineUsersSlice } from "./onlineUsers/onlineUsersSlice";
import { chatSlice } from "./chat/chatSlice";
import { messageSlice } from "./message/messageSlice";
import { messageAlarmSlice } from "./messageAlarm/messageAlarmSlice";
import { userRelationSlice } from "./userRelation/userRelationSlice";
import { alarmSlice } from "./alarm/alarmSlice";
import { suggestedUserSlice } from "./suggestedUser/suggestedUserSlice";
import { usersEntitiesSlice } from "./user/usersEntitiesSlice";
import { elasticSearchPostsSlice } from "./search/elasticSearchPostSlice";
import loadingSlice from "./loading/loadingSlice";
import errorSlice from "./error/errorSlice";

const store = configureStore({
  reducer: {
    User: userSlice.reducer,
    GetUserPosts: getUserPostsSlice.reducer,
    Signup: signupSlice.reducer,
    GetAllPosts: getAllPostsSlice.reducer,
    GetPostDetail: getPostDetailSlice.reducer,
    UserInfo: userInfoSlice.reducer,
    OnlineUsersSlice: onlineUsersSlice.reducer,
    ChatRoomSlice: chatSlice.reducer,
    MessageSlice: messageSlice.reducer,
    messageAlarmSlice: messageAlarmSlice.reducer,
    UserRelationSlice: userRelationSlice.reducer,
    AlarmSlice: alarmSlice.reducer,
    SuggestedUserSlice: suggestedUserSlice.reducer,
    UsersEntitiesSlice: usersEntitiesSlice.reducer,
    ElasticSearchPostsSlice: elasticSearchPostsSlice.reducer,
    LodingSlice: loadingSlice,
    errorSlice: errorSlice,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
