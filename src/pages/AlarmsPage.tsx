import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import { selectAlarms } from "..//store/alarm/alarmSelector";
import AlarmItem from "../components/atoms/alram/AlramItem";
import { EmptyState } from "../components/common/empty/EmptyState";
import { theme } from "../theme/theme";
export const AlarmsPage = () => {
  let alarms = useSelector(selectAlarms);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        overflow: scrollY,
      }}
    >
      {alarms.length > 0 ? (
        alarms.map((el, index) => {
          return (
            <AlarmItem
              key={index}
              id={el.id}
              senderId={el.senderId}
              receiverId={el.receiverId}
              targetId={el.targetId}
              targetType={el.targetType}
              alarmType={el.alarmType}
              isRead={el.isRead}
              createdAt={el.createdAt}
              senderNickname={el.senderNickname}
            />
          );
        })
      ) : (
        <EmptyState
          icon={
            <NotificationsPausedIcon
              sx={{
                color: theme.palette.fontColor.icon,
                width: "2rem",
              }}
            />
          }
          title={"알람이 없습니다"}
          description={"새로운 활동이 생기면 여기에 표시돼요"}
        />
      )}
    </Box>
  );
};
