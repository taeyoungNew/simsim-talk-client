import { Box, Typography } from "@mui/material";
import { ChatRoomCard } from "../molecules/ChatRoomCard";
import { useAppSelector } from "../../store/hook";
import { RootState } from "../../store";
import { BaseEmptyState } from "./empty/BaseEmptyState";

export const MyChattingRooms = () => {
  const chatList = useAppSelector(
    (state: RootState) => state.ChatRoomSlice.chatList,
  );

  return (
    <Box
      sx={{
        height: "15rem",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: "10px",
        padding: "0.8rem",
        display: "flex",
        overflowX: "hidden",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          padding: "0.2rem",
          fontSize: "1rem",
          fontWeight: "Bold",
          marginBottom: "0.2rem",
        }}
      >
        my chatting rooms
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          flex: 1,
          overflowY: "auto",
          maxHeight: "inherit",
          scrollbarGutter: "stable",
        }}
      >
        {chatList.length > 0 ? (
          chatList.map((el, index) => {
            return (
              <ChatRoomCard
                key={index}
                chatRoomId={el.chatRoomId}
                targetUserId={el.targetUserId}
                targetUserEmail={el.targetUserEmail}
                targetUserNickname={el.targetUserNickname}
                lastMessagePreview={el.lastMessagePreview}
                lastMessageType={el.lastMessageType}
                lastMessageAt={el.lastMessageAt}
              />
            );
          })
        ) : (
          <BaseEmptyState
            title={"아직 대화가 없습니다"}
            description={"친구에게 메시지를 보내 대화를 시작해보세요"}
            titleSize={0.7}
            descriptionSize={0.7}
          />
        )}
      </Box>
    </Box>
  );
};
