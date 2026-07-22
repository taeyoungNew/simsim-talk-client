import { Box } from "@mui/material";
import { UserPageBody } from "./UserPageBody";
import { UserPageHeader } from "./UserPageHeader";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../store";
import { useLocation, useParams } from "react-router-dom";
import { resetIsLast, resetUserPosts } from "../../store/post/userPostsSlice";
import {
  resetFollowings,
  resetFollowers,
} from "../../store/user/userInfoSlice";
import { useAppDispatch } from "../../store/hook";
import { useSelector } from "react-redux";
import { blockByMeUserListThunk } from "../../store/blocked/blockThunk";

export const UserPageDetail = () => {
  const [viewContent, setViewContent] = useState<
    | "userPosts"
    | "userInfo"
    | "editUserInfo"
    | "followers"
    | "followings"
    | "blockedUsers"
  >("userPosts");

  const [isEditProfile, setIsEditProfile] = useState(false);
  const path = location.pathname;
  let isMyPage = useLocation().state?.myPage;
  const prevPathName = useLocation().state?.prevPathName || "";
  const myId = useSelector((state: RootState) => state.User.id);
  const userId = path.toString().substring(10);
  const dispatch = useAppDispatch();

  let paramUserId;

  paramUserId = isMyPage ? myId : userId;

  useEffect(() => {
    console.log("isMyPage = ", isMyPage);
    if (isMyPage) dispatch(blockByMeUserListThunk());
    if (path !== prevPathName) {
      return () => {
        dispatch(resetIsLast());
        dispatch(resetUserPosts());
        dispatch(resetFollowings());
        dispatch(resetFollowers());
      };
    }
  }, [location.pathname]);
  return (
    <Box sx={{ display: "grid", gap: "0.5rem" }}>
      <UserPageHeader
        onViewContent={setViewContent}
        onEditClick={() => setIsEditProfile(true)}
        isMyPage={isMyPage}
        userId={paramUserId}
      ></UserPageHeader>
      <UserPageBody
        viewContent={viewContent}
        onViewContent={setViewContent}
        isMyPage={isMyPage}
        onEditClick={() => setIsEditProfile(false)}
        isEditProfile={isEditProfile}
        userId={paramUserId}
      ></UserPageBody>
    </Box>
  );
};
