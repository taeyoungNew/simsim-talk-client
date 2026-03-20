import { Box, Button, Grid2, Typography } from "@mui/material";
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
import {
  postLikeCencelThunk,
  postLikeThunk,
} from "../../store/like/postLikeThunk";
import { useAppDispatch } from "../../store/hook";

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
  const dispatch = useAppDispatch();
  const prevPathName = location.pathname;
  const isOnline = onlineUsers ? checkOnline(userId, onlineUsers) : false;
  const myId = useSelector((state: RootState) => state.User.id);
  const isMy = myId === userId ? true : false;
  const profileUrl = useSelector(selectUserProfileById(userId));

  const postLike = async (e: React.MouseEvent<HTMLElement>) => {
    await dispatch(postLikeThunk(id));
  };

  const deleteLike = async (e: React.MouseEvent<HTMLElement>) => {
    await dispatch(postLikeCencelThunk(id));
  };

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
        <DetailPostLink
          to={`/postDetail/${id}`}
          className={({ isActive }) =>
            isActive
              ? "no-underline text-black font-bold"
              : "no-underline text-gray-500"
          }
          state={{ from: to, isLiked, userId, prevPathName }}
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
              <Box
                component={"div"}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
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
              </Box>

              <Typography
                sx={{
                  color: (theme) => theme.palette.fontColor.main,
                }}
              >
                {userNickname}
              </Typography>
            </Grid2>

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
                    <Box
                      sx={{ display: "flex", gap: 1, verticalAlign: "center" }}
                    >
                      {!isLiked ? (
                        <Box
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation();
                            e.preventDefault();
                            postLike(e);
                          }}
                        >
                          <HeartIcon
                            color={theme.palette.fontColor.icon}
                            fillColor={theme.palette.background.paper}
                            size={30}
                          ></HeartIcon>
                        </Box>
                      ) : (
                        <Box
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteLike(e);
                          }}
                        >
                          <HeartIcon
                            color={theme.palette.background.paper}
                            fillColor={theme.palette.fontColor.isLike}
                            size={30}
                          ></HeartIcon>
                        </Box>
                      )}
                      <Typography
                        color={theme.palette.fontColor.icon}
                        sx={{ fontSize: "1.2em" }}
                      >
                        {likeCnt}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, verticalAlign: "center" }}
                    >
                      <Box>
                        <ChatDuotone
                          color={theme.palette.fontColor.main}
                          fillColor={theme.palette.background.paper}
                          size={30}
                        ></ChatDuotone>
                      </Box>
                      <Typography
                        color={theme.palette.fontColor.icon}
                        sx={{ fontSize: "1.2em" }}
                      >
                        {commentsCnt}
                      </Typography>
                    </Box>
                  </Grid2>
                </Box>
              </Grid2>
            </Box>
          </Grid2>
        </DetailPostLink>
      </Box>
    </>
  );
};
