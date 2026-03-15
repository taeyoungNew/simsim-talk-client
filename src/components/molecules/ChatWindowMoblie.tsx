import {
  Box,
  Typography,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { theme } from "../../theme/theme";
import { CustomAvatar } from "../../assets/icons/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { TextBubble } from "../atoms/chatBubbles/TextBubble";
import TelegramIcon from "@mui/icons-material/Telegram";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import MaximizeIcon from "@mui/icons-material/Maximize";
import { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { leaveChatRoom, sendMessageEvent } from "../../sockets/chatSocket";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectMessagesByRoom } from "../../store/message/messageSelector";
import { getSocket } from "../../sockets";
import { ImageBubble } from "../atoms/chatBubbles/ImageBubble";
import { FileBubble } from "../atoms/chatBubbles/FileBubble";
import { getMessageTypeFormFile } from "../../utils/getMessageType";
import {
  fileUploadThunk,
  imgUploadThunk,
} from "../../store/message/messageThunk";
import { useAppDispatch } from "../../store/hook";
import { markAlarmAsReadByRoomThunk } from "../../store/messageAlarm/messageAlarmThunk";
import { selectUserProfileById } from "../../store/user/usersEntitiesSelector";

type SendMessagePayload = {
  chatRoomId: string;
  originalName: string;
  targetUserId: string;
  content: string;
  contentType: "TEXT" | "FILE" | "SYSTEM" | "IMAGE";
};

interface ChatWindowMobileProps {
  chatRoomId: string;
  targetUserNickname: string;
  targetUserId: string;
  targetUserProfile: string;
  isActive: boolean;
}

export const ChatWindowMobile = ({
  chatRoomId,
  targetUserNickname,
  targetUserId,
  targetUserProfile,
  isActive,
}: ChatWindowMobileProps) => {
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const myId = useSelector((state: RootState) => state.User.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const socket = getSocket();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messages = useSelector(selectMessagesByRoom(chatRoomId));
  const dispath = useAppDispatch();
  const profileUrl = useSelector(selectUserProfileById(targetUserId));

  useEffect(() => {
    dispath(markAlarmAsReadByRoomThunk({ chatRoomId }));
    socket?.emit("getChatHistory", { chatRoomId });
  }, [chatRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native); // 이모지 추가
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const getFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = getMessageTypeFormFile(file);

    const payment = {
      file,
      chatRoomId,
      targetUserId,
    };

    if (type === "IMAGE") {
      dispath(imgUploadThunk(payment));
    } else {
      dispath(fileUploadThunk(payment));
    }
  };

  const closeChatWindow = () => {
    leaveChatRoom(dispath, chatRoomId);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const payment: SendMessagePayload = {
      chatRoomId,
      originalName: "",
      targetUserId,
      content: message,
      contentType: "TEXT",
    };
    sendMessageEvent(payment);
    setMessage("");
  };

  return (
    <Box
      sx={{
        borderRadius: "10px 10px 0 0",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        zIndex: 2000,
        display: { xs: "flex", md: "none" },
        flexDirection: "column",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* header */}
      <Box
        sx={{
          borderRadius: "10px 10px 0 0",
          backgroundColor: "#2563EB",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexGrow: "1" }}>
          <CustomAvatar
            profileUrl={profileUrl}
            sx={{ display: "flex", width: "1.5rem", marginRight: "0.2rem" }}
          />
          <Typography
            sx={{
              color: theme.palette.background.paper,
            }}
          >
            {targetUserNickname}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            component={"div"}
            onClick={closeChatWindow}
          >
            <CloseIcon
              sx={{
                fontSize: "1.3rem",
                cursor: "pointer",
                color: theme.palette.background.paper,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: isMinimized ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: theme.palette.background.paper,
            height: "89vh",
          }}
          overflow={"scroll"}
        >
          {Array.isArray(messages) &&
            messages.map((el, index) => {
              const isMyMsg = el.senderId === myId;

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    marginTop: "0.5rem",
                    right: 1,
                    justifyContent: isMyMsg ? "flex-end" : "flex-start",
                  }}
                >
                  {el.contentType === "TEXT" ? (
                    <TextBubble content={`${el.content}`} isMyChat={isMyMsg} />
                  ) : el.contentType === "IMAGE" ? (
                    <ImageBubble
                      imageUrl={`${el.content}`}
                      isMyChat={isMyMsg}
                    />
                  ) : el.contentType === "FILE" ? (
                    <FileBubble
                      fileName={`${el.originalName}`}
                      fileUrl={`${el.content}`}
                      isMyChat={isMyMsg}
                    />
                  ) : (
                    <Box></Box>
                  )}
                </Box>
              );
            })}
          <div ref={bottomRef} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            padding: "0.5rem",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <IconButton
              sx={{ width: "2rem", height: "2rem" }}
              onClick={() => handleOpenFile()}
            >
              <AttachFileIcon
                sx={{
                  color: theme.palette.fontColor.icon,
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              startAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setOpenEmoji((prev) => !prev)}>
                    <TagFacesIcon sx={{ cursor: "pointer" }} />
                  </IconButton>
                </InputAdornment>
              }
              disableUnderline
              sx={{
                width: "100%",
                border: "1px solid black",
                borderRadius: "40px",
              }}
              inputProps={{
                style: {
                  fontSize: "0.8rem",
                  padding: "0.5rem",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              onClick={sendMessage}
              sx={{ width: "2rem", height: "2rem" }}
            >
              <TelegramIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: theme.palette.fontColor.icon,
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={getFile}
      />

      {/* 이모지 피커 팝업 */}
      {openEmoji && (
        <Box
          sx={{
            position: "absolute",
            bottom: "50px",
            left: 0,
            zIndex: 100,
          }}
        >
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </Box>
      )}
    </Box>
  );
};
