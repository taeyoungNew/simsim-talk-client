import { ThemeProvider } from "@emotion/react";
import "./App.css";
import { theme } from "./theme/theme";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignupPage } from "./pages/SignupPage";
import { NoPage } from "./pages/NoPage";
import { UserPageDetail } from "./pages/userPageDetail/UserPageDetail";
import { Applayout } from "./layout/Applayout";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import UnAuthRoute from "./route/UnAuthRoute";
import { authMeThunk } from "./store/auth/authThunk";
import { PostDetail } from "./pages/postDetail/PostDetail";
import AuthRoute from "./route/AuthRoute";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { getSocket, initSocket } from "./sockets";
import {
  getFollowingsThunk,
  getFriendsThunk,
} from "./store/userRelation/userRelationThunk";
import { getChatsThunk } from "./store/chat/chatThunk";
import { getAllAlarmByUserThunk } from "./store/alarm/alarmThunk";
import { SuggestedFriendsPage } from "./pages/suggestedFriends/SuggestedFriendsPage";
import GlobalLoading from "./components/common/loading/GlobalLoading";
import { loadingCntSelector } from "./store/loading/loadingSelector";
import GlobalSnackbar from "./components/common/snackbar/GlobalSnackbar";
import { loadingEnd, loadingStart } from "./store/loading/loadingSlice";

function App() {
  const dispatch = useAppDispatch();
  const isLogin = useSelector((state: RootState) => state.User.isLogin);
  const isLoading = useSelector(loadingCntSelector);

  const { id, initialized } = useSelector((state: RootState) => state.User);
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(authMeThunk());
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    // 소켓연결은 사이트에 접속했을때
    // 새로고침을 했을때만
    initSocket(dispatch);
  }, []);

  useEffect(() => {
    const init = async () => {
      dispatch(loadingStart());
      try {
        await Promise.all([
          dispatch(getFollowingsThunk()),
          dispatch(getFriendsThunk()),
          dispatch(getChatsThunk()),
          dispatch(getAllAlarmByUserThunk()),
        ]);
      } finally {
        dispatch(loadingEnd());
      }
    };
  });

  // useEffect(() => {
  //   if (isLogin) {
  //     dispatch(loadingStart());
  //     try {
  //       await Promise.all([
  //       dispatch(getFollowingsThunk());
  //       dispatch(getFriendsThunk());
  //       dispatch(getChatsThunk());
  //       dispatch(getAllAlarmByUserThunk());
  //     ]);

  //     } finally {
  //       dispatch(loadingEnd());
  //     }
  //   }
  // }, [isLogin]);
  useEffect(() => {
    const socket = getSocket();
    if (id && socket) {
      // 새 소켓 연결 시 온라인 등록
      socket.emit("registerOnline", { userId: id });

      const interval = setInterval(() => {
        socket?.emit("heartbeat", { userId: id });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [id]);

  // if (!initialized) {
  //   return <div>로딩중</div>;
  // }
  // console.log("import.meta.env", import.meta.env);
  // console.log("import.meta.env", import.meta.env.VITE_SOCKET_BASE);
  return (
    <>
      <GlobalSnackbar />
      <GlobalLoading open={isLoading} />
      <ThemeProvider theme={theme}>
        <CssBaseline></CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Applayout />}>
              <Route index element={<MainPage />} />
              <Route
                path="/login"
                element={
                  <UnAuthRoute>
                    <LoginPage />
                  </UnAuthRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <UnAuthRoute>
                    <SignupPage />
                  </UnAuthRoute>
                }
              />
              <Route
                path="/myPage"
                element={
                  <AuthRoute>
                    <UserPageDetail />
                  </AuthRoute>
                }
              />
              <Route path="/userPage/:userId" element={<UserPageDetail />} />
              <Route
                path="/postDetail/:postId"
                element={<PostDetail></PostDetail>}
              />
              <Route
                path="/suggestedFriendsPage"
                element={
                  <AuthRoute>
                    <SuggestedFriendsPage />
                  </AuthRoute>
                }
              />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
