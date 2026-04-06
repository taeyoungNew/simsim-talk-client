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
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ minWidth: { md: "20rem" }, minHeight: { md: "15rem" } }}>
        <Box
          sx={{
            display: "flex",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
            {modalTitle}
          </Typography>
          <IconButton onClick={() => onClose()}>
            <CloseIcon sx={{ fontSize: { md: "1rem" } }} />
          </IconButton>
        </Box>
        <DialogContent>{children}</DialogContent>
      </Box>
    </Dialog>
  );
}
