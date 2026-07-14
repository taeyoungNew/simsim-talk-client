import { Box, Typography } from "@mui/material";
import { CustomAvatar } from "../../assets/icons/Avatar";
import { DynamicCustomButton } from "../atoms/buttons/DynamicCustomButton";
import { theme } from "../../theme/theme";

interface BlockUserCardProp {
  profileUrl: string;
  userId: string;
  nickname: string;
  onlineUsers: string[];
}

export const BlockUserCard = ({}) => {
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
          <CustomAvatar sx={{ width: "3rem", height: "3rem" }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            닉네임
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
        <DynamicCustomButton
          color={theme.palette.background.paper}
          backgroundColor={theme.palette.fontColor.icon}
          title={"차단"}
        />
      </Box>
    </Box>
  );
};
