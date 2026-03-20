import { Button } from "@mui/material";
import { ReactNode } from "react";
import { styled } from "@mui/material";

interface DynamicCustomButtonProps {
  title: string;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  fontSize?: {};
  variant?: "text" | "outlined" | "contained";
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  borderRadius?: string;
  paddingY?: string;
  paddingX?: string;
  backgroundColor?: string;
  fontWeight?: string;
}

export const DynamicCustomButton = ({
  title,
  color,
  disabled,
  fullWidth,
  icon,
  onClick,
  fontSize,
  variant,
  paddingX,
  paddingY,
  backgroundColor,
  fontWeight,
}: DynamicCustomButtonProps) => {
  return (
    <Button
      startIcon={icon}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        fontSize,
        color: color,
        fontWeight,
        paddingX,
        paddingY,
        backgroundColor: backgroundColor,
      }}
    >
      {title}
    </Button>
  );
};
