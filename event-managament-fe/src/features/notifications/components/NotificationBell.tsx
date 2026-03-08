
"use client";

import React from "react";
import { useNotificationBell } from "../hooks/useNotificationBell";
import { useThemeStore } from "@/features/theme/stores/themeStore";
// MUI
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { timeAgo } from "@/utils/timeUtils";

const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleMarkAsRead,
    handleMarkAllAsRead
  } = useNotificationBell();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "inherit",
          border: "2px solid transparent",
          borderRadius: 0,
          "&:hover": { 
            borderColor: "#ee2b8c", 
            bgcolor: isDark ? "rgba(238, 43, 140, 0.15)" : "rgba(238, 43, 140, 0.05)" 
          },
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#ee2b8c",
              color: "white",
              fontWeight: 900,
              borderRadius: 0,
              fontSize: "10px",
              border: `1px solid ${isDark ? "#000" : "#000"}`,
              boxShadow: "1px 1px 0px 0px black"
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 320,
            maxHeight: 480,
            overflow: "auto",
            borderRadius: 0,
            border: "2px solid #ee2b8c",
            boxShadow: `6px 6px 0px 0px ${isDark ? "rgba(238, 43, 140, 0.5)" : "#ee2b8c"}`,
            mt: 1.5,
            bgcolor: isDark ? "#0a0a0a" : "white",
            backgroundImage: "none",
            color: isDark ? "white" : "inherit"
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: isDark ? "#ee2b8c" : "inherit" }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="caption" 
              onClick={handleMarkAllAsRead}
              sx={{ 
                cursor: "pointer", 
                color: "#ee2b8c", 
                fontWeight: 700, 
                "&:hover": { textDecoration: "underline" } 
              }}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
        
        {loading && notifications.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={24} sx={{ color: "#ee2b8c" }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color={isDark ? "grey.500" : "text.secondary"} sx={{ fontStyle: "italic" }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((un) => (
            <MenuItem 
              key={un.id} 
              onClick={() => {
                if (!un.isRead) handleMarkAsRead(un.id);
                handleClose();
              }}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.5,
                bgcolor: un.isRead ? "transparent" : (isDark ? "rgba(238, 43, 140, 0.1)" : "rgba(238, 43, 140, 0.03)"),
                borderLeft: un.isRead ? "none" : "4px solid #ee2b8c",
                py: 1.5,
                whiteSpace: "normal",
                "&:hover": { bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(238, 43, 140, 0.08)" }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: un.isRead ? 600 : 900, fontSize: "13px", color: isDark ? "white" : "inherit" }}>
                {un.notification.title}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "11px", lineHeight: 1.4, color: isDark ? "grey.400" : "text.secondary" }}>
                {un.notification.message}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "9px", mt: 0.5, color: isDark ? "grey.600" : "#888", fontWeight: 700, textTransform: "uppercase" }}>
                {timeAgo(un.createdAt)}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
