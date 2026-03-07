"use client";

import React from "react";
import Link from "next/link";
import { useMainNavbar } from "./useMainNavbar";

// MUI Components
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// MUI Icons
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Campaign from "@mui/icons-material/Campaign";
import NotificationBell from "../../../features/notifications/components/NotificationBell";
import CartDrawer from "@/features/cart/components/CartDrawer";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Badge from "@mui/material/Badge";
import { motion, AnimatePresence } from "framer-motion";

// Hamburger Icon
const MenuIcon = () => <Bars3Icon className="w-5 h-5 md:w-6 md:h-6" />;

// Close Icon
const CloseIcon = () => <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />;

const MainNavbar: React.FC = () => {
  const {
    pathname,
    isOpen,
    toggle,
    close,
    isAuthenticated,
    user,
    isOrganizer,
    isDark,
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleLogout,
    cartOpen,
    setCartOpen,
    cartItemsCount,
  } = useMainNavbar();

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-[#333] px-3 md:px-6 lg:px-10 py-3 md:py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className="flex items-center gap-1.5 md:gap-3">
            <div className="size-7 md:size-9 lg:size-10 text-[#ee2b8c] dark:text-[#FF00FF] animate-pulse">
              <svg
                className="w-full h-full drop-shadow-[0_0_8px_rgba(238,43,140,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[#ee2b8c] to-[#d61f7a] dark:from-[#FF00FF] dark:to-[#B026FF] pr-1 pb-1">
              Hype
            </h2>
          </Link>
        </div>

        {/* Center/Right: Desktop Links and Actions */}
        <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-8 font-display tracking-wide uppercase text-[10px] lg:text-xs font-bold">
          <Link
            href="/"
            className={`${
              pathname === "/" 
                ? "text-[#ee2b8c] dark:text-[#FF00FF] drop-shadow-[0_0_5px_currentColor]" 
                : "text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#FF00FF]"
            } transition-all`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`${
              pathname.startsWith("/events") 
                ? "text-[#ee2b8c] dark:text-[#FF00FF] drop-shadow-[0_0_5px_currentColor]" 
                : "text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#FF00FF]"
            } transition-all`}
          >
            Events
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-4 lg:gap-8">
          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Cart Icon */}
                <Tooltip title="View Cart">
                  <IconButton 
                    onClick={() => setCartOpen(true)}
                    sx={{ 
                      color: isDark ? "#fff" : "#1a1a1a",
                      "&:hover": { color: "#ee2b8c" }
                    }}
                  >
                    <Badge 
                      badgeContent={cartItemsCount} 
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#ee2b8c",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: 0,
                          border: "1px solid black"
                        }
                      }}
                    >
                      <ShoppingCartIcon className="size-6" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Avatar Button */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{
                      border: "2px solid",
                      borderColor: open ? "#ee2b8c" : "transparent",
                      borderRadius: 0,
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#ee2b8c" },
                    }}
                  >
                    <Avatar
                      alt={user?.name || "User"}
                      src={user?.avatarUrl}
                      sx={{ width: 32, height: 32, borderRadius: 0 }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Dropdown Menu — Neon Hype Style */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      bgcolor: isDark ? "#0a0a0a" : "#ffffff",
                      color: isDark ? "#fff" : "#111",
                      border: "2px solid #ee2b8c",
                      borderRadius: 0,
                      boxShadow: "6px 6px 0px 0px #ee2b8c",
                      mt: 1.5,
                      minWidth: 260,
                      "& .MuiMenuItem-root": {
                        borderRadius: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: isDark ? "#ccc" : "#555",
                        py: 1.2,
                        "&:hover": {
                          bgcolor: isDark ? "rgba(238, 43, 140, 0.1)" : "rgba(238, 43, 140, 0.06)",
                          color: "#ee2b8c",
                        },
                      },
                      "& .MuiListItemIcon-root": {
                        color: isDark ? "#888" : "#999",
                        minWidth: 36,
                      },
                      "& .MuiMenuItem-root:hover .MuiListItemIcon-root": {
                        color: "#ee2b8c",
                      },
                      "& .MuiDivider-root": {
                        borderColor: isDark ? "#222" : "#eee",
                        my: 0.5,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: isDark ? "#0a0a0a" : "#ffffff",
                        border: "2px solid #ee2b8c",
                        borderBottom: "none",
                        borderLeft: "none",
                        transform: "translateY(-50%) rotate(-45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* User Profile Header */}
                  <div
                    style={{
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderBottom: isDark ? "1px dashed #333" : "1px dashed #ddd",
                    }}
                  >
                    <Avatar
                      alt={user?.name || "User"}
                      src={user?.avatarUrl}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 0,
                        border: "2px solid #ee2b8c",
                        boxShadow: "3px 3px 0px 0px #ee2b8c",
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: 14,
                          lineHeight: 1.3,
                          color: isDark ? "#fff" : "#111",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.name || "User"}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#888",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>

                  {/* Organizer Store Section */}
                  {isOrganizer && user?.organizer && (
                    <MenuItem
                      component="a"
                      href="/dashboard"
                      onClick={handleClose}
                      sx={{
                        py: "12px !important",
                        px: "16px !important",
                        bgcolor: "rgba(168, 85, 247, 0.08) !important",
                        borderBottom: isDark ? "1px dashed #333" : "1px dashed #ddd",
                        gap: 1.5,
                        "&:hover": {
                          bgcolor: "rgba(168, 85, 247, 0.18) !important",
                          color: "#A855F7 !important",
                        },
                      }}
                    >
                      <Avatar
                        src={user.organizer.logoUrl || undefined}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 0,
                          bgcolor: "#A855F7",
                          fontSize: 15,
                          fontWeight: 900,
                          border: "2px solid #A855F7",
                          boxShadow: "3px 3px 0px 0px #7C3AED",
                        }}
                      >
                        {user.organizer.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#A855F7",
                          }}
                        >
                          ⚡ My Event Organizer
                        </span>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 13,
                            color: isDark ? "#fff" : "#111",
                            textTransform: "none",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.organizer.name}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, color: "#555" }}>→</span>
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={handleClose}
                    component="a"
                    href="/user-referral"
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>

                  <MenuItem
                    onClick={handleClose}
                    component="a"
                    href="/user/orders"
                  >
                    <ListItemIcon>
                      <ShoppingCartIcon className="w-5 h-5" />
                    </ListItemIcon>
                    My Vibes
                  </MenuItem>

                  {!isOrganizer && (
                    <MenuItem
                      onClick={handleClose}
                      component="a"
                      href="/become-organizer"
                      sx={{
                        color: "#A855F7 !important",
                        "&:hover": {
                          bgcolor: "rgba(168, 85, 247, 0.12) !important",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Campaign fontSize="small" sx={{ color: "#A855F7 !important" }} />
                      </ListItemIcon>
                      Become Organizer
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      "&:hover": {
                        color: "#ef4444 !important",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "#666",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ef4444 !important",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link
                  href="/login"
                  className="flex min-w-[60px] lg:min-w-[70px] cursor-pointer items-center justify-center rounded-none h-7 md:h-8 lg:h-9 px-2 md:px-3 lg:px-4 bg-transparent border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all text-[10px] lg:text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] lg:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] lg:dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex min-w-[60px] lg:min-w-[70px] cursor-pointer items-center justify-center rounded-none h-7 md:h-8 lg:h-9 px-2 md:px-3 lg:px-4 bg-[#ee2b8c] dark:bg-[#FF00FF] text-white dark:text-black hover:bg-[#d61f7a] dark:hover:bg-[#00FFFF] transition-colors text-[10px] lg:text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#d61f7a] lg:shadow-[3px_3px_0px_0px_#d61f7a] dark:shadow-[2px_2px_0px_0px_#B026FF] lg:dark:shadow-[3px_3px_0px_0px_#B026FF]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions Overlay Trigger */}
          <div className="md:hidden flex items-center gap-1.5">
            {isAuthenticated && (
              <>
                <IconButton 
                  size="small"
                  onClick={() => setCartOpen(true)}
                  sx={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                  <Badge badgeContent={cartItemsCount} color="primary" sx={{ "& .MuiBadge-badge": { borderRadius: 0 } }}>
                    <ShoppingCartIcon className="size-5" />
                  </Badge>
                </IconButton>
                <NotificationBell />
              </>
            )}
            <button
              onClick={toggle}
              className="text-gray-800 dark:text-white p-1.5 hover:text-[#ee2b8c] dark:hover:text-[#FF00FF] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-[49px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-lg overflow-y-auto"
          >
            <nav className="flex flex-col items-center gap-3 py-6 px-5">
              {/* User Profile Card (authenticated) */}
              {isAuthenticated && (
                <div className="w-full max-w-[280px] border-2 border-[#ee2b8c] dark:border-[#FF00FF] p-4 mb-2 shadow-[4px_4px_0px_0px_#ee2b8c] dark:shadow-[4px_4px_0px_0px_#FF00FF] bg-white dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 border-2 border-[#ee2b8c] dark:border-[#FF00FF] shadow-[3px_3px_0px_0px_#ee2b8c] dark:shadow-[3px_3px_0px_0px_#FF00FF] overflow-hidden flex-shrink-0">
                      <img
                        src={user?.avatarUrl}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm uppercase tracking-wide text-gray-900 dark:text-white truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Organizer Store Card */}
                  {isOrganizer && user?.organizer && (
                    <Link
                      href="/dashboard"
                      onClick={close}
                      className="flex items-center gap-3 p-2.5 bg-purple-50 dark:bg-[#A855F7]/10 border border-dashed border-[#A855F7]/40 hover:border-[#A855F7] transition-all group"
                    >
                      <div className="w-9 h-9 bg-[#A855F7] border-2 border-[#A855F7] shadow-[2px_2px_0px_0px_#7C3AED] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user.organizer.logoUrl ? (
                          <img
                            src={user.organizer.logoUrl}
                            alt={user.organizer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-black text-sm">
                            {user.organizer.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#A855F7]">
                          ⚡ My Event Organizer
                        </p>
                        <p className="text-xs font-bold text-gray-800 dark:text-white truncate group-hover:text-[#A855F7] transition-colors">
                          {user.organizer.name}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs">→</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation Links */}
              <Link
                href="/"
                onClick={close}
                className={`${
                  pathname === "/"
                    ? "text-[#ee2b8c] dark:text-[#FF00FF]"
                    : "text-gray-800 dark:text-white"
                } text-xl font-display font-bold uppercase tracking-wide transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/events"
                onClick={close}
                className={`${
                  pathname.startsWith("/events")
                    ? "text-[#ee2b8c] dark:text-[#FF00FF]"
                    : "text-gray-800 dark:text-white"
                } text-xl font-display font-bold uppercase tracking-wide hover:text-[#ee2b8c] dark:hover:text-[#FF00FF] transition-colors`}
              >
                Events
              </Link>
              <Link
                href="/marketplace"
                onClick={close}
                className={`${
                  pathname.startsWith("/marketplace")
                    ? "text-[#ee2b8c] dark:text-[#FF00FF]"
                    : "text-gray-800 dark:text-white"
                } text-xl font-display font-bold uppercase tracking-wide hover:text-[#ee2b8c] dark:hover:text-[#FF00FF] transition-colors`}
              >
                Marketplace
              </Link>
              <Link
                href="/community"
                onClick={close}
                className={`${
                  pathname.startsWith("/community")
                    ? "text-[#ee2b8c] dark:text-[#FF00FF]"
                    : "text-gray-800 dark:text-white"
                } text-xl font-display font-bold uppercase tracking-wide hover:text-[#ee2b8c] dark:hover:text-[#FF00FF] transition-colors`}
              >
                Community
              </Link>

              {/* Authenticated Action Links */}
              {isAuthenticated && (
                <div className="w-full max-w-[280px] flex flex-col gap-1.5 mt-3 border-t-2 border-dashed border-gray-200 dark:border-gray-800 pt-4">
                  <Link
                    href="/user-referral"
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#ee2b8c] hover:bg-[#ee2b8c]/5 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#ee2b8c] hover:bg-[#ee2b8c]/5 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                    </svg>
                    Settings
                  </Link>

                  <Link
                    href="/user/orders"
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#ee2b8c] hover:bg-[#ee2b8c]/5 transition-all"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    My Vibes
                  </Link>

                  {!isOrganizer && (
                    <Link
                      href="/become-organizer"
                      onClick={close}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#A855F7] hover:bg-[#A855F7]/10 transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 11v2h-2v-2h2zm-4 2v-2H6v2h8zM4 5h16v14H4V5zm0-2c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4z" />
                      </svg>
                      Become Organizer
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      close();
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 transition-all mt-1 border-t border-dashed border-gray-200 dark:border-gray-800 pt-3 w-full"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}

              {/* Guest Login/SignUp */}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4 w-full max-w-[200px]">
                  <Link
                    href="/login"
                    onClick={close}
                    className="w-full text-center py-2.5 border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white font-bold uppercase tracking-wider text-xs"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={close}
                    className="w-full text-center py-2.5 bg-[#ee2b8c] dark:bg-[#FF00FF] text-white dark:text-black font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#d61f7a] dark:shadow-[3px_3px_0px_0px_#B026FF]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default MainNavbar;
