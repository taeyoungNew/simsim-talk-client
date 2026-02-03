import { styled } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ForumIcon from "@mui/icons-material/Forum";
import { forwardRef } from "react";

const ChattingFunc = styled(Button)(({ theme }) => ({
  maxWidth: "7rem",
  borderRadius: "10px",
  border: `1px solid  ${theme.palette.chatCardColor.readBd}`,
  color: `${theme.palette.chatCardColor.readMsg}`,
  padding: "6px 16px",
  backgroundColor: theme.palette.background.paper,
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.chatCardColor.unreadBadgeBg,
    color: `${theme.palette.background.paper}`,
  },
}));

export const ChattingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <ChattingFunc ref={ref} {...props} startIcon={<ForumIcon />}>
        채팅
      </ChattingFunc>
    );
  },
);
