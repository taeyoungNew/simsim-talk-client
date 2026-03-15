import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { CustomTextArea } from "./atoms/inputs/CustomTextArea";
import VideocamIcon from "@mui/icons-material/Videocam";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { useForm, Controller } from "react-hook-form";
import { createPostThunk } from "../store/post/allPostsThunk";
import { useAppDispatch } from "../store/hook";
import { CustomAvatar } from "../assets/icons/Avatar";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import "../assets/style/emojiPicker/emojiPikerPost.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { selectUserProfileById } from "../store/user/usersEntitiesSelector";
interface WritePost {
  content: string;
}

export const WritePost = () => {
  const userId = useSelector((state: RootState) => state.User.id);
  const profileUrl = useSelector(selectUserProfileById(userId));
  const dispatch = useAppDispatch();
  const [emojiPos, setEmojiPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const { control, handleSubmit, reset, watch, setValue, getValues } =
    useForm<WritePost>({
      defaultValues: {
        content: "",
      },
    });
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [openEmoji, setOpenEmoji] = useState(false);

  const emojiRef = useRef<HTMLDivElement | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!openEmoji) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        emojiRef.current?.contains(target) ||
        emojiButtonRef.current?.contains(target)
      ) {
        return; // 내부 클릭 → 무시
      }

      setOpenEmoji(false); // 외부 클릭 → 닫기
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEmoji]);
  const writePost = async (data: WritePost) => {
    const normalized = data.content.replace(/\n{2,}/g, "\n");

    await dispatch(createPostThunk(normalized));
    reset();
  };
  const handleEmojiToggle = () => {
    if (openEmoji) {
      setOpenEmoji(false);
      return;
    }

    const el = emojiButtonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    setEmojiPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setOpenEmoji(true);
  };
  const handleSelect = () => {
    const el = textAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setEmojiPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    selectionRef.current = {
      start: el.selectionStart,
      end: el.selectionEnd,
    };
  };

  return (
    <form onSubmit={handleSubmit(writePost)}>
      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: "1rem",
          width: "inherit",
          marginBottom: "0.5rem",
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            padding: "0",
            marginRight: "0.8rem",
          }}
        >
          <CustomAvatar profileUrl={profileUrl} sx={{ width: "2.5rem" }} />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              marginBottom: "0.5rem",
              borderRadius: "8px",
              padding: "0.8rem",
              width: "inherit",
              background: (theme) => theme.palette.background.default,
            }}
          >
            <Controller
              name="content"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: "글자수를 300이하로 입력해주십시오",
                },
              }}
              render={({ field }) => {
                const handleEmojiSelect = (emoji: any) => {
                  const textarea = textAreaRef.current;
                  if (!textarea) return;

                  const { start, end } = selectionRef.current;
                  const value = textarea.value;
                  const emojiText = emoji.emoji;

                  const newValue =
                    value.slice(0, start) + emojiText + value.slice(end);

                  field.onChange(newValue); // ✅ 여기선 100% 정상

                  const nextCursor = start + emojiText.length;

                  requestAnimationFrame(() => {
                    textarea.focus();
                    textarea.setSelectionRange(nextCursor, nextCursor);
                    selectionRef.current = {
                      start: nextCursor,
                      end: nextCursor,
                    };
                  });
                };
                return (
                  <>
                    <CustomTextArea
                      minRows={5}
                      maxRows={10}
                      {...field}
                      ref={(el: HTMLTextAreaElement | null) => {
                        field.ref(el);
                        textAreaRef.current = el;
                      }}
                      onClick={handleSelect}
                      onKeyUp={handleSelect}
                      onFocus={handleSelect}
                      onChange={(e) => {
                        field.onChange(e);
                        handleSelect();
                      }}
                    />

                    {openEmoji && emojiPos && (
                      <Box
                        ref={emojiRef}
                        sx={{
                          position: "absolute",
                          top: emojiPos.top,
                          left: emojiPos.left,
                          zIndex: 100,
                        }}
                      >
                        <EmojiPicker
                          width={"19rem"}
                          height={"18rem"}
                          previewConfig={{ showPreview: false }}
                          searchDisabled
                          onEmojiClick={handleEmojiSelect}
                        />
                      </Box>
                    )}
                  </>
                );
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "felx", alignItems: "center" }}>
              <Button
                ref={emojiButtonRef}
                onClick={handleEmojiToggle}
                sx={{ color: (theme) => theme.palette.fontColor.icon }}
              >
                <TagFacesIcon></TagFacesIcon>
              </Button>
            </Box>
            <Button type="submit">게시</Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};
