import { Box } from "@mui/material";
import { useAppSelector } from "../store/hook";
import { RootState } from "../store";
import { ChatRoomCardMobile } from "../components/molecules/ChatRoomCardMobile";
import { BaseEmptyState } from "../components/common/empty/BaseEmptyState";
import { useSelector } from "react-redux";
import { ChatWindowMobile } from "../components/molecules/ChatWindowMoblie";

export const ChattingsPage = () => {
  const chatList = useAppSelector(
    (state: RootState) => state.ChatRoomSlice.chatList,
  );
  const activeChatRoomId = useSelector(
    (state: RootState) => state.ChatRoomSlice.activeChatRoomId,
  );
  const opendChatRooms = useSelector(
    (state: RootState) => state.ChatRoomSlice.openedChatRooms,
  );
  const opendChatInfo = opendChatRooms.filter(
    (el) => el.chatRoomId === activeChatRoomId,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        overflow: activeChatRoomId ? "" : scrollY,
        height: "100vh",
      }}
    >
      {/* {activeChatRoomId ? (
        <ChatWindowMobile
          chatRoomId={opendChatInfo[0].chatRoomId}
          targetUserNickname={opendChatInfo[0].targetUserNickname}
          targetUserId={opendChatInfo[0].targetUserId}
          targetUserProfile={""}
          isActive={false}
        />
      ) : (
        <></>
      )} */}
      {chatList.length > 0 ? (
        chatList.map((el, index) => {
          return (
            <ChatRoomCardMobile
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
  );
};
