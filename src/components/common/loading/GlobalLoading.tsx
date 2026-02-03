import { Backdrop, CircularProgress, Box } from "@mui/material";
import { theme } from "../../../theme/theme";

interface LoadingOverlayProps {
  open: boolean;
  zIndex?: number;
}
const LoadingOverlay = ({ open, zIndex = 1300 }: LoadingOverlayProps) => {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex,
        backdropFilter: "blur(2px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CircularProgress
          style={{ color: theme.palette.chatCardColor.unreadBd }}
          size={48}
          thickness={4}
        />
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
