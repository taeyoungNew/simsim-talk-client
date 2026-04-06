import {
  Badge,
  Box,
  Button,
  Drawer,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import { CustomAvatar } from "../../assets/icons/Avatar";
import EditButton from "../../components/atoms/buttons/EditButton";
import { ChattingButton } from "../../components/atoms/buttons/ChattingButton";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import {
  changeMyBackgroundImgThunk,
  changeMyProfileImgThunk,
  myInfoThunk,
  userInfoThunk,
} from "../../store/user/userInfoThunk";
import {
  followingCencelThunk,
  followingThunk,
} from "../../store/follow/followThunk";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { theme } from "../../theme/theme";

import { getMessageTypeFormFile } from "../../utils/getMessageType";
import {
  selectUserBackgroundById,
  selectUserProfileById,
} from "../../store/user/usersEntitiesSelector";
import { ImageZoomDialog } from "../../components/common/ImageZoomDialog";
import { chatThunk } from "../../store/chat/chatThunk";
import React from "react";
import { DynamicCustomButton } from "../../components/atoms/buttons/DynamicCustomButton";
import { logoutThunk } from "../../store/auth/authThunk";
import { logout } from "../../store/auth/authAction";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../components/molecules/common/modal/CommonModal";
import WithdrawConfirmModal from "../../components/organisms/user/WithdrawConfirmModal";

interface HeaderProps {
  onViewContent: React.Dispatch<
    React.SetStateAction<
      "userPosts" | "userInfo" | "editUserInfo" | "followers" | "followings"
    >
  >;
  onEditClick: () => void;
  isMyPage: boolean;
  userId: string;
}

export const UserPageHeader = ({
  userId,
  isMyPage,
  onViewContent,
}: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profileImgInputRef = useRef<HTMLInputElement>(null);
  const backgroundImgInputRef = useRef<HTMLInputElement>(null);
  const userInfo = useSelector((state: RootState) => state.UserInfo);
  const postCnt = useSelector((state: RootState) => state.UserInfo.postCnt);
  const profileUrl = useSelector(selectUserProfileById(userId));
  const backgroundUrl = useSelector(selectUserBackgroundById(userId));
  const [profileOpen, setProfileOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const following = async () => {
    await dispatch(
      followingThunk({
        followId: userId,
        isMyPage,
        followingNickname: userInfo.nickname,
      }),
    );
  };
  const openChatWindow = async (e: { currentTarget: HTMLElement }) => {
    setTimeout(() => {
      dispatch(
        chatThunk({
          targetUserId: userId,
          targetUserNickname: userInfo.nickname,
        }),
      );
    }, 0);
  };
  const zoomInBackgroundImg = async (e: React.MouseEvent) => {
    await setBackgroundOpen(true);
    e.stopPropagation();
  };
  const zoomInProfileImg = (e: React.MouseEvent) => {
    setProfileOpen(true);
    e.stopPropagation();
    userPgMenuClose;
  };

  const handleOpenProfileImg = (e: React.MouseEvent) => {
    profileImgInputRef.current?.click();
    e.stopPropagation();
  };

  const handleOpenBackgroundImg = (e: React.MouseEvent) => {
    backgroundImgInputRef.current?.click();
    e.stopPropagation();
  };

  const [showUserPgMenuAnchorEl, setShowUserPgAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setShowUserPgAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const [showUserPgDropMenuAnchorEl, setShowUserDropPgAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleOpenDropMenu = (e: React.MouseEvent<HTMLElement>) => {
    setShowUserDropPgAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const userPgMenuClose = async (e: React.MouseEvent<HTMLElement>) => {
    setShowUserPgAnchorEl(null);
    e.stopPropagation();
  };

  const userPgDropMenuClose = async (e: React.MouseEvent<HTMLElement>) => {
    setShowUserDropPgAnchorEl(null);
    e.stopPropagation();
  };

  const openWithdrawCofirmModal = async (e: React.MouseEvent<HTMLElement>) => {
    setWithdrawConModalOpen(!withdrawConModalOpen);
  };

  const logoutFunc = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await dispatch(logoutThunk({ userId: userId }));
    setShowUserPgAnchorEl(null);
    dispatch(logout());
  };

  const userPgDropMenuOpen = Boolean(showUserPgDropMenuAnchorEl);
  const userPgMenuOpen = Boolean(showUserPgMenuAnchorEl);

  const getBackgroundImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = getMessageTypeFormFile(file);
    if (type !== "IMAGE") {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const payment = {
      userId,
      file,
    };

    dispatch(changeMyBackgroundImgThunk(payment));
  };

  const getProfileImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = getMessageTypeFormFile(file);
    if (type !== "IMAGE") {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const payment = {
      userId,
      file,
    };

    dispatch(changeMyProfileImgThunk(payment));
  };

  const [withdrawConModalOpen, setWithdrawConModalOpen] = useState(false);

  const followingCencel = async () => {
    await dispatch(
      followingCencelThunk({
        followId: userId,
        isMyPage,
        followingNickname: userInfo.nickname,
      }),
    );
  };

  useEffect(() => {
    if (isMyPage) {
      dispatch(myInfoThunk(userId));
    } else {
      dispatch(userInfoThunk(userId));
    }
  }, [userId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        height: "18rem",
        width: "100%",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <WithdrawConfirmModal
        key={1}
        open={withdrawConModalOpen}
        onClose={() => setWithdrawConModalOpen(false)}
      />
      <Box
        onClick={zoomInBackgroundImg}
        sx={{
          cursor: "pointer",
          padding: "1rem",
          display: "flex",
          flexDirection: "column-reverse",
          position: "relative",
          borderRadius: "10px 10px 0 0",
          flex: 1,
          minHeight: "30%",
          backgroundImage: backgroundUrl
            ? `url(${backgroundUrl})`
            : "linear-gradient(to right, #3b82f6, #9333ea)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isMyPage ? (
          <IconButton
            onClick={isMobile ? handleOpenMenu : handleOpenDropMenu}
            sx={{
              // display: { xs: "flex", md: "none" },
              display: "flex",
              position: "absolute",
              top: "5%",
              right: { xs: "3%", md: "0.5rem" },
              translate: "50%, 50%",
            }}
          >
            <MenuIcon
              sx={{
                fontSize: "2rem",
                color: theme.palette.fontColor.icon,
              }}
            />
          </IconButton>
        ) : (
          <Box />
        )}
        <Menu
          id="basic-menu"
          anchorEl={showUserPgDropMenuAnchorEl}
          open={userPgDropMenuOpen}
          onClose={userPgDropMenuClose}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          <MenuItem
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            onClick={userPgDropMenuClose}
          >
            <DynamicCustomButton
              title="Logout"
              onClick={logoutFunc}
              color={theme.palette.error.main}
            />
            <DynamicCustomButton
              title="Delete user"
              onClick={openWithdrawCofirmModal}
              color={theme.palette.error.dark}
            />
          </MenuItem>
        </Menu>

        <Drawer anchor="top" open={userPgMenuOpen} onClose={userPgMenuClose}>
          <DynamicCustomButton
            title="Logout"
            onClick={logoutFunc}
            color={theme.palette.error.main}
          />
        </Drawer>
        <Box>
          <CustomAvatar
            onClick={zoomInProfileImg}
            sx={{
              cursor: "pointer",
              width: "7.5rem",
              position: "absolute",
              translate: "-50% -50%",
              left: { xs: "18%", md: "10%" },
              top: { xs: "100%", md: "95%" },
              maxHeight: { xs: "4rem", md: "7.5rem" },
              maxWidth: { xs: "4rem", md: "7.5rem" },
            }}
            profileUrl={profileUrl}
          />

          {isMyPage ? (
            <IconButton
              sx={{
                position: "absolute",
                left: { xs: "20%", md: "5.9rem" },
                top: { xs: "9rem", md: "8.9rem" },
                color: "white",
              }}
              onClick={(e) => handleOpenProfileImg(e)}
            >
              <AutorenewIcon
                sx={{
                  border: `0.2px solid black`,
                  borderRadius: "70%",
                  backgroundColor: "#fff",
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  color: theme.palette.fontColor.assist,
                }}
              />
            </IconButton>
          ) : (
            <Box />
          )}
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: { xs: 0.25, md: 0.2 } }}></Box>
          <Box sx={{ flex: 0.7 }}>
            <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
              {userInfo.nickname}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
              flex: 0.1,
            }}
          >
            {isMyPage ? (
              <IconButton
                onClick={(e) => handleOpenBackgroundImg(e)}
                sx={{ padding: 0 }}
              >
                <PhotoOutlinedIcon
                  sx={{ fontSize: "2rem", color: theme.palette.fontColor.main }}
                />
              </IconButton>
            ) : (
              <Box />
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: { xs: "0.5rem", md: "1rem" },
          display: "flex",
          flex: 1,
        }}
      >
        <Box sx={{ flex: { xs: 0.3, md: 0.2 } }}></Box>
        <Box
          sx={{
            display: "flex",
            flex: { xs: 0.7, md: 0.8 },
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", flex: 1 }}>
            <Box
              sx={{
                flex: 0.8,
                width: "100%",
                maxHeight: "4.5rem",
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  maxWidth: "20rem",
                  whiteSpace: "pre-wrap",
                  color: (theme) => theme.palette.fontColor.icon,
                }}
              >
                {userInfo.aboutMe}
              </Typography>
            </Box>

            {/* <Button>프로필변경</Button> */}
            <Box
              sx={{ justifyContent: "end", display: "flex", flex: 0.6, gap: 1 }}
            >
              {isMyPage ? (
                <>
                  <Box>
                    <EditButton onClick={() => onViewContent("editUserInfo")} />
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    {userInfo.isFollowinged ? (
                      <Button
                        sx={{
                          background: (theme) =>
                            theme.palette.background.default,
                          color: (theme) => theme.palette.fontColor.icon,
                        }}
                        onClick={followingCencel}
                      >
                        팔로잉중
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          background: (theme) => theme.palette.primary.main,
                          color: (theme) => theme.palette.background.paper,
                        }}
                        onClick={following}
                      >
                        팔로잉
                      </Button>
                    )}
                  </Box>

                  <Box>
                    <ChattingButton
                      onClick={openChatWindow}
                      sx={{ width: "8rem" }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 0.25,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.4rem" } }}>
                  {postCnt}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                  게시물
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 0.25,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.4rem" } }}>
                  {userInfo.followingCnt}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                  팔로잉
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 0.25,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.4rem" } }}>
                  {userInfo.followerCnt}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                  팔로워
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <ImageZoomDialog
        open={backgroundOpen}
        onClose={() => setBackgroundOpen(false)}
        src={backgroundUrl}
      />
      <ImageZoomDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        src={profileUrl}
      />

      <input
        type="file"
        ref={profileImgInputRef}
        style={{ display: "none" }}
        onChange={getProfileImg}
      />
      <input
        type="file"
        ref={backgroundImgInputRef}
        style={{ display: "none" }}
        onChange={getBackgroundImg}
      />
    </Box>
  );
};
