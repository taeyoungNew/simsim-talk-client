import { Box, Button, Typography } from "@mui/material";
import CommonModal from "../../molecules/common/modal/CommonModal";
import { deletePostThunk } from "../../../store/post/postDetailThunk";
import { useAppDispatch } from "../../../store/hook";
import {
  AsyncThunkAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../theme/theme";

interface WithdrawConfirmModalProps {
  postId: number;
  open: boolean;
  from: string;
  isMyPage: boolean;
  onClose: () => void;
}

export default function DeletePostConfirmModal({
  postId,
  open,
  from,
  isMyPage,
  onClose,
}: WithdrawConfirmModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const deletePost = async () => {
    await dispatch(deletePostThunk(postId));
    navigate(from, { state: { myPage: isMyPage } });
  };

  return (
    <CommonModal open={open} onClose={onClose} modalTitle={"게시물삭제"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "inherit",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ width: "80%" }}>
            해당 게시물을 삭제하시겠습니까?
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <Button
            sx={{ color: theme.palette.error.main, fontSize: { xs: "0.8rem" } }}
            onClick={deletePost}
          >
            remove
          </Button>
        </Box>
      </Box>
    </CommonModal>
  );
}
function dispatch(
  arg0: AsyncThunkAction<
    number,
    number,
    {
      rejectValue: Error;
      state?: unknown;
      dispatch?: ThunkDispatch<unknown, unknown, UnknownAction> | undefined;
      extra?: unknown;
      serializedErrorType?: unknown;
      pendingMeta?: unknown;
      fulfilledMeta?: unknown;
      rejectedMeta?: unknown;
    }
  >,
) {
  throw new Error("Function not implemented.");
}
