import { useState } from "react";
import CommonModal from "../../molecules/common/modal/CommonModal";
import { Typography } from "@mui/material";
import { CustomTextArea } from "../../atoms/inputs/CustomTextArea";

interface WithdrawConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WithdrawConfirmModal({
  open,
  onClose,
}: WithdrawConfirmModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {};

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      modalTitle="회원탈퇴를 진행하시겠습니까?"
    >
      <Typography sx={{ fontSize: 15 }}></Typography>
      <CustomTextArea />
    </CommonModal>
  );
}
