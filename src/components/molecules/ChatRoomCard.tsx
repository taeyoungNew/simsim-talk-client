import { Box, Typography } from "@mui/material";
import { AvatarMenu } from "./AvatarMenu";
import { EllipsisText } from "../atoms/text/EllipsisText";
import { truncateText } from "../../utils/truncateText";
import { CustomAvatar } from "../../assets/icons/Avatar";
import { theme } from "../../theme/theme";
import { chatThunk } from "../../store/chat/chatThunk";
import { useAppDispatch } from "../../store/hook";
import { useSelector } from "react-redux";
import { selectUnreadMsgAlarmCntByRoom } from "../../store/messageAlarm/messageAlarmSelector";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { selectUserProfileById } from "../../store/user/usersEntitiesSelector";

interface ChatRoomCardProps {
  chatRoomId: string;
  targetUserId: string;
  targetUserEmail: string;
  targetUserNickname: string;
  lastMessagePreview: string;
  lastMessageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  lastMessageAt: string;
  isBlocked: boolean;
}

export const ChatRoomCard = ({
  chatRoomId,
  lastMessageAt,
  lastMessagePreview,
  lastMessageType,
  targetUserEmail,
  targetUserId,
  targetUserNickname,
  isBlocked,
}: ChatRoomCardProps) => {
  const dispatch = useAppDispatch();
  const unreadMsgByChat = useSelector(
    selectUnreadMsgAlarmCntByRoom(chatRoomId),
  );
  const profileUrl = useSelector(selectUserProfileById(targetUserId));
  const openChatWindow = async (e: { currentTarget: HTMLElement }) => {
    setTimeout(() => {
      dispatch(chatThunk({ targetUserId, targetUserNickname }));
    }, 0);
  };
  return (
    <Box
      component={"div"}
      onClick={openChatWindow}
      sx={{
        width: "100%",
        border: `0.4px solid ${unreadMsgByChat > 0 ? theme.palette.chatCardColor.unreadBd : theme.palette.chatCardColor.readBd}`,
        backgroundColor:
          unreadMsgByChat > 0
            ? theme.palette.chatCardColor.unreadBg
            : theme.palette.chatCardColor.readBg,
        borderRadius: "5px",
        padding: { xs: "0.5rem", md: "0.2rem" },
        cursor: "pointer",
        height: { xs: "5rem", md: "auto" },
        display: "flex",
        gap: 1,
        alignItems: { xs: "top", md: "center" },
        ":hover": {
          border: `0.4px solid ${theme.palette.chatCardColor.hoverBd}`,
        },
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <CustomAvatar profileUrl={profileUrl} sx={{ width: "1.8rem" }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            color:
              unreadMsgByChat > 0
                ? theme.palette.chatCardColor.unreadNickname
                : theme.palette.chatCardColor.readNickname,
          }}
        >
          {targetUserNickname}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color:
              unreadMsgByChat > 0
                ? theme.palette.chatCardColor.unreadMsg
                : theme.palette.chatCardColor.readMsg,
          }}
        >
          {lastMessagePreview !== null
            ? truncateText(lastMessagePreview, 8)
            : ""}
        </Typography>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "0.1rem",
          width: "2.3rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.6rem",
            color:
              unreadMsgByChat > 0
                ? theme.palette.chatCardColor.unreadTime
                : theme.palette.fontColor.assist,
          }}
        >
          {formatRelativeTime(lastMessageAt)}
        </Typography>
        <Box
          sx={{
            borderRadius: "50%",
            width: "1rem",
            color: "#fff",
            backgroundColor:
              unreadMsgByChat > 0
                ? theme.palette.chatCardColor.unreadBadgeBg
                : theme.palette.fontColor.assist,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Typography sx={{ fontSize: "0.7rem" }}>{unreadMsgByChat}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
