import { Box } from "@mui/material";
import { ChatWindow } from "../../molecules/ChatWindow";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface chatContainerProps {
  roomId: string;
  targetUserId: string;
  nickname: string;
}

export const ChatContainer = ({}) => {
  const opendChatRooms = useSelector(
    (state: RootState) => state.ChatRoomSlice.openedChatRooms,
  );
  const activeChatRoomId = useSelector(
    (state: RootState) => state.ChatRoomSlice.activeChatRoomId,
  );

  return (
    <Box
      sx={{
        position: { md: "fixed" },
        right: "5%",
        bottom: { md: -5 },
        display: { xs: "none", md: "flex" },
        alignItems: "flex-end",
        gap: "1%",
      }}
    >
      {opendChatRooms.map((el, index) => {
        const isActive = el.chatRoomId === activeChatRoomId;
        return (
          <ChatWindow
            key={index}
            chatRoomId={el.chatRoomId}
            targetUserNickname={el.targetUserNickname}
            targetUserId={el.targetUserId}
            targetUserProfile={""}
            isActive={isActive}
            isBlocked={el.isBlocked}
          />
        );
      })}
    </Box>
  );
};
