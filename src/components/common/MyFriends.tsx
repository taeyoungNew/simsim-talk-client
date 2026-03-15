import { Box, Typography, SxProps, Theme } from "@mui/material";
import { FriendsCard } from "../molecules/FriendCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { EmptyState } from "./empty/EmptyState";
import { BaseEmptyState } from "./empty/BaseEmptyState";

interface MyFriendsProps {
  sx?: SxProps<Theme>;
}

export const MyFriends = ({ sx, ...props }: MyFriendsProps) => {
  const friends = useSelector(
    (state: RootState) => state.UserRelationSlice.friends,
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.OnlineUsersSlice.ids,
  );
  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "100%",
        height: "13rem",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: "10px",
        padding: "0.8rem",
        overflow: "hidden",
        flexDirection: "column",
        ...sx,
      }}
      // {...props}
    >
      <Typography sx={{ fontSize: "1rem", fontWeight: "Bold" }}>
        friends
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflowY: "scroll",
          height: "10rem",
          scrollbarGutter: "stable",
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
