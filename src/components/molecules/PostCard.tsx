import { Box, Grid2, Typography } from "@mui/material";
import { HeartIcon } from "../../assets/icons/Heart";
import { ChatDuotone } from "../../assets/icons/ChatDuotone";
import { theme } from "../../theme/theme";
import { NavLink } from "react-router-dom";
import { CustomAvatar } from "../../assets/icons/Avatar";
import styled from "styled-components";
import { checkOnline } from "../../utils/checktOnline";
import { AvatarMenu } from "./AvatarMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectUserProfileById } from "../../store/user/usersEntitiesSelector";
import SectionLoading from "../common/loading/SectionLoading";

interface CardProps {
  id: number;
  userId: string;
  contents: string;
  userNickname: string;
  likeCnt: number;
  isLiked: boolean;
  commentsCnt: number;
  onlineUsers?: string[];
}
const DetailPostLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }

  &.active {
    font-weight: bold;
  }
`;

export const PostCard = ({
  id,
  userId,
  userNickname,
  contents,
  likeCnt,
  isLiked,
  commentsCnt,
  onlineUsers,
}: CardProps) => {
  const to = location.pathname;
  const prevPathName = location.pathname;
  const isOnline = onlineUsers ? checkOnline(userId, onlineUsers) : false;
  const myId = useSelector((state: RootState) => state.User.id);
  const isMy = myId === userId ? true : false;
  const profileUrl = useSelector(selectUserProfileById(userId));

  return (
    <>
      <Box
        sx={{
          borderRadius: "10px",
          width: "inherit",
          padding: "10px",
          bgcolor: (theme) => theme.palette.background.paper,
        }}
        color={theme.palette.fontColor.main}
      >
        <Grid2
          sx={{ display: "flex", justifyContent: "center" }}
          container
          direction="column"
          rowSpacing={2}
        >
          <Grid2
            alignItems={"center"}
            container
            direction="row"
            display={"flex"}
            spacing={1}
          >
            <AvatarMenu
              sx={{ width: "2rem" }}
              profileUrl={profileUrl}
              isOnline={isOnline}
              isMy={isMy}
              id={id}
              isLiked={isLiked}
              to={to}
              userId={userId}
              userNickname={userNickname}
              key={id}
            />

            <Typography
              sx={{
                color: (theme) => theme.palette.fontColor.main,
              }}
            >
              {userNickname}
            </Typography>
          </Grid2>
          <DetailPostLink
            to={`/postDetail/${id}`}
            className={({ isActive }) =>
              isActive
                ? "no-underline text-black font-bold"
                : "no-underline text-gray-500"
            }
            state={{ from: to, isLiked, userId, prevPathName }}
          >
            <Box sx={{ cursor: "pointer" }}>
              <Grid2
                sx={{
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box width="100%" height="auto" overflow={"hidden"}>
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      textOverflow: "ellipsis",
                      maxHeight: "100px",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      padding: "0 0.5em",
                      color: (theme) => theme.palette.fontColor.main,
                    }}
                  >
                    {contents}
                  </Typography>
                </Box>
              </Grid2>
              <Grid2 sx={{ padding: "5px", bgcolor: "none" }}>
                <Box>
                  <Grid2 container spacing={1} sx={{ display: "flex" }}>
                    <HeartIcon
                      color={
                        isLiked
                          ? theme.palette.background.paper
                          : theme.palette.fontColor.assist
                      }
                      fillColor={
                        isLiked
                          ? theme.palette.fontColor.isLike
                          : theme.palette.background.paper
                      }
                      size={30}
                    ></HeartIcon>

                    {likeCnt}

                    <ChatDuotone
                      color={theme.palette.fontColor.main}
                      fillColor={theme.palette.background.paper}
                      size={30}
                    ></ChatDuotone>
                    {commentsCnt}
                  </Grid2>
                </Box>
              </Grid2>
            </Box>
          </DetailPostLink>
        </Grid2>
      </Box>
    </>
  );
};
