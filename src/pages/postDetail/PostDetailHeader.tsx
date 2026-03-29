import { Box, Button, Modal, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { CustomAvatar } from "../../assets/icons/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Dispatch, SetStateAction, useState } from "react";
import { theme } from "../../theme/theme";
import { useAppDispatch } from "../../store/hook";
import { deletePostThunk } from "../../store/post/postDetailThunk";
import {
  followingCencelThunk,
  followingThunk,
} from "../../store/follow/followThunk";
import { selectUserProfileById } from "../../store/user/usersEntitiesSelector";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
interface PostDetailHeaderProps {
  isMyPage: boolean;
  from: string;
  postId: number;
  userNickname: string;
  userId: string;
  isFollowinged: boolean;
  setIsModifyPost: Dispatch<SetStateAction<boolean>>;
  isModifyPost: boolean;
}

export const PostDetailHeader = ({
  from,
  postId,
  userNickname,
  userId,
  isFollowinged,
  setIsModifyPost,
  isModifyPost,
}: PostDetailHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openDeletePostModal, setOpenDeletePostModal] = useState(false);
  const profileUrl = useSelector(selectUserProfileById(userId));
  const myId = useSelector((state: RootState) => state.User.id);
  const detailPostLinkPath =
    myId === userId ? `/myPage` : `/userPage/${userId}`;
  const isMyPage = myId === userId ? true : false;
  const prevPathName = location.pathname;
  const isMyPost = myId === userId;

  const deletePostHandleOpen = () => {
    setOpenDeletePostModal(true);
  };

  const deletePostHandleClose = () => {
    setOpenDeletePostModal(false);
  };

  const modifyPostHandler = () => {
    setIsModifyPost((prev) => !prev);
  };

  const deletePost = async () => {
    await dispatch(deletePostThunk(postId));
    deletePostHandleClose();
    navigate(from, { state: { myPage: isMyPage } });
  };

  const following = async () => {
    await dispatch(
      followingThunk({
        followId: userId,
        isMyPage,
        followingNickname: userNickname,
      }),
    );
  };

  const followingCencel = async () => {
    await dispatch(
      followingCencelThunk({
        followId: userId,
        isMyPage,
        followingNickname: userNickname,
      }),
    );
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <NavLink to={`${from}`} state={{ myPage: isMyPage }}>
            <Button sx={{ color: (theme) => theme.palette.fontColor.main }}>
              Back
            </Button>
          </NavLink>
          {isMyPost === true ? (
            <Box>
              <Button onClick={modifyPostHandler}>
                {isModifyPost ? "cencel" : "update"}
              </Button>
              <Button onClick={deletePostHandleOpen}>DELETE</Button>
            </Box>
          ) : (
            <Box></Box>
          )}
          {/* 게시물삭제알림창 */}
          <Modal
            open={openDeletePostModal}
            onClose={deletePostHandleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
            sx={{ padding: { xs: "0.3rem" } }}
          >
            <Box sx={{ ...style }}>
              <Typography
                sx={{ fontSize: { xs: "0.6rem" } }}
                color={theme.palette.primary.dark}
              >
                해당 게시물을 삭제하시겠습니까?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  sx={{ fontSize: { xs: "0.8rem" } }}
                  onClick={deletePost}
                >
                  remove
                </Button>
                <Button
                  sx={{ fontSize: { xs: "0.8rem" } }}
                  onClick={deletePostHandleClose}
                >
                  Cancle
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box>
              <NavLink
                to={detailPostLinkPath}
                state={{ myPage: isMyPage, prevPathName }}
              >
                <Button>
                  <CustomAvatar profileUrl={profileUrl}></CustomAvatar>
                </Button>
              </NavLink>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: (theme) => theme.palette.fontColor.main,
                }}
              >
                {userNickname}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: (theme) => theme.palette.fontColor.icon,
                }}
              >
                팔로워 1
              </Typography>
            </Box>
          </Box>
          {isMyPost ? (
            <Box />
          ) : isFollowinged ? (
            <Box>
              <Button
                sx={{
                  background: (theme) => theme.palette.background.default,
                  color: (theme) => theme.palette.fontColor.icon,
                }}
                onClick={() => followingCencel()}
              >
                팔로잉중
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.background.paper,
                }}
                onClick={() => following()}
              >
                팔로잉
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
