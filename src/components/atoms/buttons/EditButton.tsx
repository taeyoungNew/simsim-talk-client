import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const EditBottonFunc = styled(Button)(({ theme }) => ({
  maxWidth: "7rem",
  borderRadius: "10px",
  border: `1px solid  ${theme.palette.primary.main}`,
  color: `${theme.palette.primary.main}`,
  // padding: "6px 16px",
  backgroundColor: theme.palette.background.paper,
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.background.paper}`,
  },
}));

// onClick 같은 Button props를 받을 수 있게 정의
interface EditButtonProps {
  onClick?: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <EditBottonFunc
      startIcon={<ModeEditOutlineOutlinedIcon />}
      onClick={onClick}
    >
      {" "}
      편집하기{" "}
    </EditBottonFunc>
  );
}
