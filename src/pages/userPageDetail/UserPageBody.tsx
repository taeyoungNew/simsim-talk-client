import { Box, Button, Grid2, ListItem, Typography } from "@mui/material";
import { PostButton } from "../../components/atoms/buttons/PostButton";
import { PostCard } from "../../components/molecules/PostCard";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../store/hook";
import { getUserPostsThunk } from "../../store/post/userPostsThunk";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Controller, useForm } from "react-hook-form";
import { editMyInfoThunk } from "../../store/user/userInfoThunk";
import { resetInitMyInfo } from "../../store/user/userInfoSlice";
import { UserInfoButton } from "../../components/atoms/buttons/UserInfoButton";
import { theme } from "../../theme/theme";
import SubTitle from "../../components/common/SubTitle";
import ModeIcon from "@mui/icons-material/Mode";
import EditBox from "../../components/atoms/box/EditBox";
import InfoBox from "../../components/atoms/box/InfoBox";
import { DynamicCustomButton } from "../../components/atoms/buttons/DynamicCustomButton";
import { FollowUserCard } from "../../components/molecules/FollowUserCard";

interface GetUserPostsReq {
  userId: string;
  postLastId: null | number;
}

interface UserPageBodyProps {
  isMyPage: boolean;
  userId: string;
  viewContent:
    | "userPosts"
    | "userInfo"
    | "editUserInfo"
    | "followings"
    | "followers"
    | "blockedUsers";
  onViewContent: React.Dispatch<
    React.SetStateAction<
      | "userPosts"
      | "userInfo"
      | "editUserInfo"
      | "followings"
      | "followers"
      | "blockedUsers"
    >
  >;
  onEditClick: () => void;
  isEditProfile: boolean;
}

type EditMyProfileType = {
  username: string;
  age: string;
  aboutMe: string;
};

type UserDetailView = "profile" | "blockedUsers" | "settings" | "bookmarks";

export const UserPageBody = ({
  onViewContent,
  onEditClick,
  viewContent,
  userId,
  isMyPage,
}: UserPageBodyProps) => {
  const dispatch = useAppDispatch();
  const userCrrInfo = useSelector((state: RootState) => state.UserInfo);
  const isEditMyInfoSuccess = useSelector(
    (state: RootState) => state.UserInfo.success,
  );
  const successEditMyInfoMsg = useSelector(
    (state: RootState) => state.UserInfo.successMessage,
  );
  const getUserPostDatas = useSelector(
    (state: RootState) => state.GetUserPosts.posts,
  );
  const isLoading = useSelector(
    (state: RootState) => state.GetUserPosts.isLoading,
  );

  const myId = useSelector((state: RootState) => state.User.id);

  let postLastId =
    getUserPostDatas[getUserPostDatas.length - 1]?.id !== undefined
      ? getUserPostDatas[getUserPostDatas.length - 1]?.id
      : null;

  const getUserPosts = async (userId: string, postLastId: null | number) => {
    const params: GetUserPostsReq = {
      userId,
      postLastId,
    };

    await dispatch(getUserPostsThunk(params));
  };

  const { handleSubmit, control } = useForm<EditMyProfileType>({
    defaultValues: {
      username: "",
      age: "",
      aboutMe: "",
    },
  });

  let ages: number[] = [];
  for (let idx = 1; idx <= 100; idx++) {
    ages.push(idx);
  }

  const editMyProfile = async (data: EditMyProfileType) => {
    let val = String(data.age);
    if (val.length > 1) {
      val = val.replace(/^0+/, "");
      if (val === "") val = "0";
    }

    const editMyProfileInfo = {
      targetId: userId,
      username: data.username,
      age: Number(val),
      aboutMe: data.aboutMe,
    };

    await dispatch(editMyInfoThunk(editMyProfileInfo));
  };

  const buttonFontSize = {
    xs: "0.8rem",
    md: "1rem",
  };
  useEffect(() => {
    if (isEditMyInfoSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetInitMyInfo());
        alert(`${successEditMyInfoMsg}`);
        onViewContent("userInfo");
        onEditClick();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isEditMyInfoSuccess, dispatch, userId]);

  // 타겟요소지정
  const lastPostRef = useRef(null);
  const observer = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    getUserPosts(userId, postLastId);
  }, [userId]);

  let isFetching = useRef(false);
  useEffect(() => {
    if (!lastPostRef.current) return;

    // 기존 옵저버 해제
    if (observer.current) {
      observer.current.disconnect();
    }

    // 옵저버생성
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          isFetching.current = true;
          if (postLastId !== 0 && !isLoading) {
            setTimeout(() => {
              isFetching.current = true;
              getUserPosts(userId, postLastId);
            }, 500);
          }
          observer.current?.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      },
    );
    // 옵저버등록
    observer.current.observe(lastPostRef.current);
    return () => {
      // 클린업: 컴포넌트 언마운트 시에도 해제
      observer.current?.disconnect();
    };
  }, [getUserPostDatas]);

  const renderContent = () => {
    switch (viewContent) {
      case "userPosts":
        return (
          <Box
            sx={{
              height: '"inherit',
            }}
          >
            <Grid2 size={12}>
              {getUserPostDatas.map((el, index) => {
                const islast = index === getUserPostDatas.length - 1;

                return (
                  <ListItem
                    key={index}
                    sx={{
                      borderRadius: "10px",
                    }}
                    ref={islast ? lastPostRef : null}
                  >
                    <Box sx={{ width: "100%" }}>
                      <PostCard
                        id={el.id}
                        userId={el.userId}
                        contents={el.content}
                        userNickname={el.userNickname}
                        likeCnt={el.likeCnt}
                        commentsCnt={el.commentCnt}
                        isLiked={el.isLiked}
                      ></PostCard>
                    </Box>
                  </ListItem>
                );
              })}
            </Grid2>
          </Box>
        );
      case "userInfo":
        return (
          <Box
            sx={{
              width: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "4rem",
            }}
          >
            <Box
              sx={{
                border: "1px ",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <SubTitle
                text={"기본정보"}
                icon={<ModeIcon></ModeIcon>}
                fontSize="1.3rem"
              ></SubTitle>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <InfoBox
                  label={`username`}
                  outLineColorProps={`${theme.palette.primary.light}`}
                  fontSize="1.2rem"
                  padding="1.0rem"
                  minHeight="60px"
                  text={`${userCrrInfo.username}`}
                ></InfoBox>
                <InfoBox
                  label={`age`}
                  outLineColorProps={`${theme.palette.primary.light}`}
                  fontSize="1.2rem"
                  padding="1.0rem"
                  minHeight="60px"
                  text={`${userCrrInfo.age}`}
                ></InfoBox>
              </Box>
              <Box>
                <InfoBox
                  label={"about me"}
                  outLineColorProps={`${theme.palette.primary.light}`}
                  fontSize="1.2rem"
                  padding="1.0rem"
                  minHeight="200px"
                  text={`${userCrrInfo.aboutMe}`}
                ></InfoBox>
              </Box>
            </Box>
          </Box>
        );
      case "editUserInfo":
        return (
          // 자신의 프로필편집
          <Box
            component={"form"}
            sx={{
              width: "inherit",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              gap: "4rem",
            }}
            onSubmit={handleSubmit(editMyProfile)}
          >
            <Box
              sx={{
                border: "1px ",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <SubTitle
                text={"기본정보수정"}
                icon={<ModeIcon></ModeIcon>}
                fontSize="1.3rem"
              ></SubTitle>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <EditBox
                        {...field}
                        width={"100%"}
                        label="username"
                        placeholder={userCrrInfo.username}
                        multiline={false}
                      ></EditBox>
                    );
                  }}
                ></Controller>
                <Controller
                  name="age"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <EditBox
                        {...field}
                        width={"100%"}
                        label={"age"}
                        placeholder={String(userCrrInfo.age)}
                        type="number"
                        maxLength={2}
                        numbericOnly={true}
                      ></EditBox>
                    );
                  }}
                ></Controller>
              </Box>
              <Box>
                <Controller
                  name="aboutMe"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <EditBox
                        {...field}
                        width={"100%"}
                        label="aboutMe"
                        placeholder={userCrrInfo.aboutMe}
                        multiline={true}
                        minRows={7}
                      ></EditBox>
                    );
                  }}
                ></Controller>
              </Box>
            </Box>
            <Button type="submit">완료</Button>
          </Box>
        );
      case "followings": {
        return (
          <Box>
            {userCrrInfo.followings.map((el) => {
              return (
                <FollowUserCard
                  profileUrl={el.profileUrl}
                  key={el.id}
                  id={el.id}
                  nickname={el.nickname}
                  username={el.username}
                  isFollowing={el.isFollowing}
                  myId={myId}
                  isMyPage={isMyPage}
                />
              );
            })}
          </Box>
        );
      }
      case "followers":
        return (
          <Box>
            {userCrrInfo.followers.map((el) => {
              return (
                <FollowUserCard
                  profileUrl={el.profileUrl}
                  key={el.id}
                  id={el.id}
                  nickname={el.nickname}
                  username={el.username}
                  isFollowing={el.isFollowing}
                  myId={myId}
                  isMyPage={isMyPage}
                />
              );
            })}
          </Box>
        );
      case "blockedUsers":
        return <Box>차단유저리스트</Box>;
      default:
        return (
          <Box
            sx={{
              height: "inherit",
            }}
          >
            <Grid2 size={12}>
              {getUserPostDatas.map((el, index) => {
                const islast = index === getUserPostDatas.length - 1;

                return (
                  <ListItem
                    key={index}
                    sx={{
                      borderRadius: "10px",
                    }}
                    ref={islast ? lastPostRef : null}
                  >
                    <Box sx={{ width: "100%" }}>
                      <PostCard
                        id={el.id}
                        userId={el.userId}
                        contents={el.content}
                        userNickname={el.userNickname}
                        likeCnt={el.likeCnt}
                        commentsCnt={el.commentCnt}
                        isLiked={el.isLiked}
                      ></PostCard>
                    </Box>
                  </ListItem>
                );
              })}
            </Grid2>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        padding: "1rem",
        borderRadius: "10px",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          gap: 1,
          borderBottom: "0.5px solid grey",
        }}
      >
        {viewContent !== "blockedUsers" ? (
          <>
            <PostButton
              onClick={() => onViewContent("userPosts")}
              sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
            ></PostButton>
            <UserInfoButton
              onClick={() => onViewContent("userInfo")}
              sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
            ></UserInfoButton>
            <DynamicCustomButton
              onClick={() => onViewContent("followings")}
              fontSize={buttonFontSize}
              title={"팔로잉"}
            />
            <DynamicCustomButton
              onClick={() => onViewContent("followers")}
              fontSize={buttonFontSize}
              title={"팔로워"}
            />
          </>
        ) : (
          <>
            <DynamicCustomButton
              fontSize={buttonFontSize}
              title={"차단리스트"}
              color={theme.palette.error.main}
            />
          </>
        )}
      </Box>
      {renderContent()}
    </Box>
  );
};
