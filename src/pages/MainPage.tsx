import { Box, Grid2, ListItem } from "@mui/material";
import { PostCard } from "../components/molecules/PostCard";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hook";
import { getPostsThunk } from "../store/post/allPostsThunk";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { WritePost } from "../components/WritePost";
import { loadingEnd, loadingStart } from "../store/loading/loadingSlice";
import {
  getFollowingsThunk,
  getFriendsThunk,
} from "../store/userRelation/userRelationThunk";
import { getChatsThunk } from "../store/chat/chatThunk";
import { getAllAlarmByUserThunk } from "../store/alarm/alarmThunk";

interface WritePost {
  title: string;
  content: string;
}

export const MainPage = () => {
  // const isLogin = true;
  const isLogin = useSelector((state: RootState) => state.User.isLogin);
  const onlineUsers = useSelector(
    (state: RootState) => state.OnlineUsersSlice.ids,
  );
  const getPostDatas = useSelector(
    (state: RootState) => state.GetAllPosts.posts,
  );
  const dispatch = useAppDispatch();

  const isLoading = useSelector(
    (state: RootState) => state.GetAllPosts.isLoading,
  );
  let postLastId = getPostDatas[getPostDatas.length - 1]?.id ?? 0;

  const lastPostRef = useRef(null);

  const getPosts = async (postLastId: number) => {
    await dispatch(getPostsThunk(postLastId));
  };

  const observer = useRef<IntersectionObserver | null>(null);
  let isFetching = false;
  useEffect(() => {
    const init = async () => {
      dispatch(loadingStart());
      try {
        await Promise.all([
          dispatch(getFollowingsThunk()),
          dispatch(getFriendsThunk()),
          dispatch(getChatsThunk()),
          dispatch(getAllAlarmByUserThunk()),
          console.log("???"),
          getPosts(postLastId),
        ]);
      } finally {
        dispatch(loadingEnd());
      }
    };
    init();
  }, []);

  // useEffect(() => {

  //   getPosts(postLastId);
  // }, []);

  useEffect(() => {
    if (!lastPostRef.current) return;

    // 기존 옵저버 해제
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          isFetching = true;
          if (postLastId !== 0 && !isLoading) {
            setTimeout(() => {
              isFetching = true;
              getPosts(postLastId);
            }, 500);
          }
          observer.current?.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      },
    );
    observer.current.observe(lastPostRef.current);
    return () => {
      // 클린업: 컴포넌트 언마운트 시에도 해제
      observer.current?.disconnect();
    };
  }, [getPostDatas]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "inherit",
          overflow: "scoll",
        }}
      >
        <Box
          width="100%"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        ></Box>
        {isLogin === true ? <WritePost /> : <Box />}
        <Box height="inherit">
          <Grid2 container rowSpacing={3} direction="column">
            <Grid2 size={12}>
              {getPostDatas.map((el, index) => {
                const isLast = index === getPostDatas.length - 1;

                if (isLast) {
                  postLastId = getPostDatas[index].id;
                }
                return (
                  <ListItem
                    sx={{
                      paddingTop: "0",
                      paddingLeft: "0",
                      paddingRight: "0",
                    }}
                    key={index}
                    ref={isLast ? lastPostRef : null}
                  >
                    <PostCard
                      id={el.id}
                      userId={el.userId}
                      contents={el.content}
                      userNickname={el.userNickname}
                      likeCnt={el.likeCnt}
                      isLiked={el.isLiked}
                      commentsCnt={el.commentCnt}
                      onlineUsers={onlineUsers}
                    ></PostCard>
                  </ListItem>
                );
              })}
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </>
  );
};
