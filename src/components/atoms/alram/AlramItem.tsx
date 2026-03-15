import { Box, Typography } from "@mui/material";
import { forwardRef } from "react";
import { CustomAvatar } from "../../../assets/icons/Avatar";
import { theme } from "../../../theme/theme";
import { LikeIcon } from "./LikeIcon";
import { FollowIcon } from "./FollowIcon";
import { CommentIcon } from "./CommentIcon";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";
import { useAppDispatch } from "../../../store/hook";
import { markAlarmThunk } from "../../../store/alarm/alarmThunk";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { selectUserProfileById } from "../../../store/user/usersEntitiesSelector";

interface messageAlarmProps {
  id: number;
  senderId: string;
  senderNickname: string;
  receiverId: string;
  targetId: number | string;
  targetType: "USER" | "POST" | "COMMENT" | "SYSTEM";
  alarmType: "FOLLOW" | "LIKE" | "COMMENT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}
const alarmItem = forwardRef<HTMLInputElement, messageAlarmProps>(
  (
    {
      alarmType,
      createdAt,
      id,
      isRead,
      receiverId,
      senderId,
      senderNickname,
      targetId,
      targetType,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const profileUrl = useSelector(selectUserProfileById(senderId));
    const postId =
      targetType === "POST" || targetType === "COMMENT"
        ? Number(targetId)
        : null;
    const isLike = useSelector((state: RootState) => {
      if (postId === null) return false;
      const post = state.GetAllPosts.posts[postId];
      return post?.isLiked ?? false;
    });
    let type = "";
    switch (targetId) {
      case "POST":
        type = "message";
        break;
      case "IMAGE":
        type = "image";
        break;
      case "FILE":
        type = "file";
        break;
    }
    const prevPath = location.pathname;
    const alarmIcon = () => {
      switch (alarmType) {
        case "LIKE":
          return <LikeIcon width={1} />;
        case "FOLLOW":
          return <FollowIcon width={1} />;
        case "COMMENT":
          return <CommentIcon width={1} />;
      }
    };
    const alarmComment = () => {
      switch (alarmType) {
        case "LIKE":
          return "좋아요를 눌렀습니다.";
        case "FOLLOW":
          return "팔로잉했습니다.";
        case "COMMENT":
          return "댓글을 달았습니다.";
      }
    };

    const markAlarmFucn = async () => {
      if (!isRead) await dispatch(markAlarmThunk({ alarmId: id }));

      let pathPathName: string;
      switch (alarmType) {
        case "FOLLOW":
          pathPathName = `/userPage/${senderId}`;

          navigate(pathPathName, {
            state: {
              myPage: false,
              prevPathName: prevPath,
            },
          });
          break;

        case "LIKE":
        case "COMMENT":
          pathPathName = `/postDetail/${targetId}`;

          navigate(pathPathName, {
            state: {
              from: prevPath,
              isLike: isLike,
              prevPathName: prevPath,
            },
          });
          break;

        default:
          break;
      }
    };

    const alarmCommentResult = alarmComment();

    return (
      <Box
        component={"div"}
        onClick={markAlarmFucn}
        sx={{
          width: "100%",
          display: "flex",
          padding: "0.5rem 0.5rem",
          gap: 0.3,
          height: { xs: "5rem", md: "3.5rem" },
          marginBottom: type === "TEXT" ? "1rem" : "",
          cursor: "pointer",
          backgroundColor: isRead
            ? theme.palette.chatCardColor.readBg
            : theme.palette.chatCardColor.unreadBg,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            width: "inherit",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ display: "flex", gap: 0.7, alignItems: "start" }}
          >
            <CustomAvatar profileUrl={profileUrl} sx={{ width: "1.8rem" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.fontColor.icon,
                  fontSize: "0.8rem",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ color: theme.palette.fontColor.main }}
                >{`${senderNickname}`}</span>
                님이 {`${alarmCommentResult}`}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.chatCardColor.readMsg,
                  fontSize: "0.6rem",
                }}
              >
                {formatRelativeTime(createdAt)}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: "0.4rem",
                      height: "0.4rem",
                      borderRadius: "70px",
                      backgroundColor: isRead
                        ? theme.palette.chatCardColor.readMsg
                        : theme.palette.chatCardColor.unreadTime,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: isRead
                      ? theme.palette.chatCardColor.readMsg
                      : theme.palette.chatCardColor.unreadTime,
                    fontSize: "0.7rem",
                  }}
                >
                  {isRead ? "읽음" : "읽지않음"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginLeft: "auto" }}>{alarmIcon()}</Box>
        </Box>
      </Box>
    );
  },
);

export default alarmItem;
