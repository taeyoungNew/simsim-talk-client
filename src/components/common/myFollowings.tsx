import { Avatar, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FollowinCard } from "../molecules/FollowingCard";
import { EmptyState } from "./empty/EmptyState";
import { BaseEmptyState } from "./empty/BaseEmptyState";

interface MyFollowingsProps {
  followingCnt: number;
}

export const MyFollowings = ({ followingCnt }: MyFollowingsProps) => {
  const followingList = useSelector(
    (state: RootState) => state.UserRelationSlice.followins,
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.OnlineUsersSlice.ids,
  );

  return (
    <>
      <Box
        sx={{
          maxWidth: "100%",
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: "10px",
          padding: "0.8rem",
          height: "15rem",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontSize: "1rem", fontWeight: "Bold" }}>
          followings
        </Typography>
        {followingCnt > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "inherit",
              scrollbarGutter: "stable",
              // scrollbarWidth: "none",
            }}
          >
            {followingList.map((el, index) => {
              return (
                <FollowinCard
                  key={index}
                  userId={el.followingId}
                  nickname={el.followingNickname}
                  onlineUsers={onlineUsers}
                  profileUrl={el.profileUrl}
                />
              );
            })}
          </Box>
        ) : (
          <BaseEmptyState
            sx={{ fontSize: "0.5rem" }}
            title={"아직 팔로우한 사용자가 없습니다"}
            description={""}
            titleSize={0.7}
            descriptionSize={0.5}
          />
        )}
      </Box>
    </>
  );
};
