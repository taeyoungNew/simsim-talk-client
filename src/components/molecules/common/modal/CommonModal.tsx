import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../../../theme/theme";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  children: React.ReactNode;
}

export default function CommonModal({
  open,
  onClose,
  modalTitle,
  children,
}: CommonModalProps) {
  return (
    <Dialog sx={{ height: "auto" }} open={open} onClose={onClose}>
      <Box sx={{ padding: "1rem" }}>
        <Box
          sx={{
            minWidth: { md: "20rem" },
            // minHeight: { md: "14rem" },
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `0.5px solid ${theme.palette.background.default}`,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
              {modalTitle}
            </Typography>

            <IconButton onClick={() => onClose()}>
              <CloseIcon sx={{ fontSize: { md: "1rem" } }} />
            </IconButton>
          </Box>
          <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
}
