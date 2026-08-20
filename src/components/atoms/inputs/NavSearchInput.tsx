import { Box, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface NavSearchInputProps {
  onSearch: (keyword: string) => void;
}

export const NavSearchInput = ({ onSearch }: NavSearchInputProps) => {
  const [keyword, setKeyword] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      onSearch(keyword.trim());
    }
  };
  return (
    <Box
      sx={{
        padding: "0.1rem 1rem",
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        maxWidth: "500px",
      }}
    >
      <SearchIcon
        sx={{
          color: (theme) => theme.palette.fontColor.icon,
          fontSize: "1.5rem",
        }}
      ></SearchIcon>

      <Input
        disableUnderline
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          borderBottomColor: "none",
          width: "20rem",
          fontSize: "0.8rem",
          color: (theme) => theme.palette.fontColor.main,
        }}
      ></Input>
    </Box>
  );
};
