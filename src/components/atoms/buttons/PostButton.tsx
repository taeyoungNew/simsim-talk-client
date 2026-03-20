import { styled } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { forwardRef } from "react";
import GridViewIcon from "@mui/icons-material/GridView";

const PostButtonFunc = styled(Button)(({ theme }) => ({}));

export const PostButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <PostButtonFunc
        ref={ref}
        {...props}
        startIcon={
          <GridViewIcon sx={{ display: { xs: "none" } }}></GridViewIcon>
        }
      >
        게시물
      </PostButtonFunc>
    );
  },
);
