import { Box, Typography } from "@mui/material";
import { CustomAvatar } from "../../assets/icons/Avatar";
import { DynamicCustomButton } from "../atoms/buttons/DynamicCustomButton";
import { theme } from "../../theme/theme";
import { useAppDispatch } from "../../store/hook";
import {
  blockUserThunk,
  unBlockUserThunk,
} from "../../store/blocked/blockThunk";

interface BlockUserCardProp {
  profileUrl: string;
  userId: string;
  nickname: string;
  isBlockinged: boolean;
}

export const BlockUserCard = ({
  nickname,
  profileUrl,
  userId,
  isBlockinged,
}: BlockUserCardProp) => {
  const dispatch = useAppDispatch();
  const blockUserFunc = async () => {
    await dispatch(blockUserThunk({ blockUserId: userId }));
  };

  const unBlockUserFunc = async () => {
    await dispatch(unBlockUserThunk({ unBlockUserId: userId }));
  };
  return (
    <Box
      sx={{
        display: "dlex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "0.5rem",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box sx={{ display: "flex", alignContent: "center" }}>
          <CustomAvatar
            profileUrl={profileUrl}
            sx={{ width: "3rem", height: "3rem" }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            {nickname}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: theme.palette.fontColor.icon,
            }}
          >
            해당 계정이 차단되었습니다.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {isBlockinged ? (
          <DynamicCustomButton
            onClick={unBlockUserFunc}
            color={theme.palette.background.paper}
            backgroundColor={theme.palette.fontColor.icon}
            title={"차단해제"}
          />
        ) : (
          <DynamicCustomButton
            onClick={blockUserFunc}
            color={theme.palette.error.main}
            backgroundColor={theme.palette.background.paper}
            title={"차단"}
          />
        )}
      </Box>
    </Box>
  );
};
