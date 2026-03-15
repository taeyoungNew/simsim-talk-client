import * as React from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Fade,
  IconButton,
  Menu,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CustomAvatar } from "../../assets/icons/Avatar";
import { selectUserProfileById } from "../../store/user/usersEntitiesSelector";
import MessasgeAlarmItem from "../atoms/alram/MessageAlramItem";
import DraftsIcon from "@mui/icons-material/Drafts";
import {
  selectUnreadMsgAlarmCnt,
  selectUnreadMsgAlarms,
} from "../../store/messageAlarm/messageAlarmSelector";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import AlarmItem from "../atoms/alram/AlramItem";
import {
  selectAlarms,
  selectUnreadAlarmCount,
} from "../../store/alarm/alarmSelector";
import { theme } from "../../theme/theme";
import { EmptyState } from "../common/empty/EmptyState";

interface NavBarProps {
  sx?: SxProps<Theme>;
}

export default function BottomNavBar({ ...props }: NavBarProps) {
  let alarms = useSelector(selectAlarms);
  let alarmCnt = useSelector(selectUnreadAlarmCount);
  let msgAlarmCnt = useSelector(selectUnreadMsgAlarmCnt);
  let msgAlarms = useSelector(selectUnreadMsgAlarms);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.User.id);
  const [_, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const prevPathName = location.pathname;
  const isLogin = useSelector((state: RootState) => state.User.isLogin);
  const menuId = "primary-search-account-menu";
  const [showAlarmAnchorEl, setShowAlarmAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const alarmOpen = Boolean(showAlarmAnchorEl);
  const [showMsgalarmAnchorEl, setShowMsgalarmAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const showMsgAlarms = async (event: React.MouseEvent<HTMLElement>) => {
    setShowMsgalarmAnchorEl(event.currentTarget);
  };
  const msgListOpen = Boolean(showMsgalarmAnchorEl);
  const profileUrl = useSelector(selectUserProfileById(userId));
  const suggetedPage = () => {
    navigate("/suggestedFriendsPage");
  };
  const closeMsgAlarms = async () => {
    setShowMsgalarmAnchorEl(null);
  };
  const showAlarms = async (event: React.MouseEvent<HTMLElement>) => {
    setShowAlarmAnchorEl(event.currentTarget);
  };
  const closeAlarms = async () => {
    setShowAlarmAnchorEl(null);
  };

  return (
    <Box {...props}>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isLogin ? "space-between" : "space-around",
            bgcolor: (theme) => theme.palette.background.paper,
          }}
        >
          {isLogin === true ? (
            <>
              <IconButton
                onClick={suggetedPage}
                size="large"
                aria-label="show 4 new mails"
              >
                <PeopleAltOutlinedIcon
                  sx={{ color: (theme) => theme.palette.fontColor.icon }}
                />
              </IconButton>

              <IconButton
                component={NavLink}
                to="/chattingList"
                sx={{ position: "relative" }}
                onClick={showMsgAlarms}
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge
                  badgeContent={msgAlarmCnt > 0 ? msgAlarmCnt : undefined}
                  color="error"
                >
                  <MailOutlineIcon
                    sx={{ color: (theme) => theme.palette.fontColor.icon }}
                  />
                </Badge>
              </IconButton>
            </>
          ) : (
            <Box>
              <NavLink to={"/login"}>
                <Button
                  color="inherit"
                  sx={{ color: (theme) => theme.palette.fontColor.main }}
                >
                  Login
                </Button>
              </NavLink>
            </Box>
          )}
          <Box>
            <Button
              component={NavLink}
              to="/"
              sx={{ color: (theme) => theme.palette.primary.contrastText }}
            >
              <Box sx={{ display: "flex", position: "relative" }}>
                <HomeIcon
                  sx={{
                    color: (theme) => theme.palette.fontColor.icon,
                    fontSize: "3rem",
                  }}
                />
              </Box>
            </Button>
          </Box>
          {isLogin === true ? (
            <>
              <IconButton
                component={NavLink}
                to="/alarms"
                onClick={showAlarms}
                size="large"
                aria-label="show 4 new mails"
              >
                <Badge badgeContent={alarmCnt} color="error">
                  <NotificationsNoneIcon
                    sx={{ color: (theme) => theme.palette.fontColor.icon }}
                  />
                </Badge>
              </IconButton>

              <NavLink to={`/myPage`} state={{ myPage: true, prevPathName }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <CustomAvatar
                    profileUrl={profileUrl}
                    sx={{ width: "2rem" }}
                  ></CustomAvatar>
                </IconButton>
              </NavLink>
            </>
          ) : (
            <Box>
              <NavLink to={"/signup"}>
                <Button
                  color="inherit"
                  sx={{ color: (theme) => theme.palette.fontColor.main }}
                >
                  Signup
                </Button>
              </NavLink>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
