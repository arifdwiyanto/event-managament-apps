"use client";

import React from "react";
import { useOrganizerNotificationBell } from "../hooks/useOrganizerNotificationBell";
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
import { BellIcon } from "@heroicons/react/24/outline";

const OrganizerNotificationBell: React.FC = () => {
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
  } = useOrganizerNotificationBell();

  return (
    <>
      <button 
        onClick={handleClick}
        className="relative text-[#5f4351] hover:text-[#ee2b8c] transition-colors p-1 outline-none"
      >
        <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 size-2 md:size-2.5 bg-[#ee2b8c] rounded-full border-2 border-white dark:border-[#221019] flex items-center justify-center">
            {/* Optional dot instead of number for a cleaner look */}
          </span>
        )}
      </button>

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
            borderRadius: "16px",
            border: "1px solid #f4f0f2",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            mt: 1.5,
            bgcolor: "white",
            "& .dark": {
              bgcolor: "#221019",
              border: "1px solid #3a1d2e",
              color: "white"
            }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#181114", ".dark &": { color: "white" } }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="caption" 
              onClick={handleMarkAllAsRead}
              sx={{ 
                cursor: "pointer", 
                color: "#ee2b8c", 
                fontWeight: 600, 
                "&:hover": { textDecoration: "underline" } 
              }}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider sx={{ borderColor: "#f4f0f2", ".dark &": { borderColor: "#3a1d2e" } }} />
        
        {loading && notifications.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={24} sx={{ color: "#ee2b8c" }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
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
                bgcolor: un.isRead ? "transparent" : "#ee2b8c0a",
                borderLeft: un.isRead ? "3px solid transparent" : "3px solid #ee2b8c",
                py: 1.5,
                px: 2,
                whiteSpace: "normal",
                "&:hover": { bgcolor: "#f8f6f7", ".dark &": { bgcolor: "#2a1621" } }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: un.isRead ? 500 : 700, fontSize: "13px", color: "#181114", ".dark &": { color: "white" } }}>
                {un.notification.title}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "12px", lineHeight: 1.4, color: "#5f4351", ".dark &": { color: "#d1c4cb" } }}>
                {un.notification.message}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "10px", mt: 0.5, color: "#896175", fontWeight: 500 }}>
                {timeAgo(un.createdAt)}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default OrganizerNotificationBell;
