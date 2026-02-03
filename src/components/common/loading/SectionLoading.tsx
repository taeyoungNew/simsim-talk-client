import { Box, CircularProgress } from "@mui/material";
import { theme } from "../../../theme/theme";

export default function SectionLoading() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        style={{ color: theme.palette.chatCardColor.unreadBd }}
      />
    </Box>
  );
}
