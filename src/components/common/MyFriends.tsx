import { Box, Typography } from "@mui/material";
import { FriendsCard } from "../molecules/FriendCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { EmptyState } from "./empty/EmptyState";
import { BaseEmptyState } from "./empty/BaseEmptyState";

export const MyFriends = () => {
  const friends = useSelector(
    (state: RootState) => state.UserRelationSlice.friends,
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.OnlineUsersSlice.ids,
  );
  return (
    <Box
      sx={{
        maxWidth: "100%",
        height: "15rem",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: "10px",
        padding: "0.8rem",
        maxHeight: "10em",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: "1rem", fontWeight: "Bold" }}>
        friends
      </Typography>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 1,
          overflow: "scroll",
          overflowY: "auto",
          scrollbarGutter: "stable",
          maxHeight: "inherit",
        }}
      >
        {friends.length > 0 ? (
          friends.map((el, index) => {
            return (
              <FriendsCard
                key={index}
                friendId={el.friendId}
                email={el.email}
                nickname={el.nickname}
                chatRoomId={el.chatRoomId}
                profileUrl={el.profileUrl}
                onlineUsers={onlineUsers}
              />
            );
          })
        ) : (
          <BaseEmptyState
            title={"아직 친구가 없습니다"}
            description={"친구를 팔로우하면 여기에 표시돼요"}
            titleSize={0.7}
            descriptionSize={0.7}
          />
        )}
      </Box>
    </Box>
  );
};
