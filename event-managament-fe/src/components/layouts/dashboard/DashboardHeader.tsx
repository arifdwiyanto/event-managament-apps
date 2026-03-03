"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import React, { useState } from "react";
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { Menu, MenuItem, IconButton, Divider } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrganizerNotificationBell from "@/features/notifications/components/OrganizerNotificationBell";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick, searchQuery, onSearchChange }) => {
  const { user, signOut } = useStoreLogin();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  return (
    <header className="h-14 md:h-16 bg-white dark:bg-[#221019] border-b border-[#f4f0f2] dark:border-[#3a1d2e] flex items-center justify-between px-3 md:px-6 lg:px-8 flex-shrink-0 z-20">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 md:p-2 -ml-1 md:-ml-2 text-[#5f4351] hover:text-[#181114] dark:hover:text-white transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-base md:text-xl font-bold text-[#181114] dark:text-white">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 bg-[#f8f6f7] dark:bg-[#2a1621] px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#e6dbe0] dark:border-[#3a1d2e]">
          <span className="text-[#896175]">
            <MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5" />
          </span>
          <input 
            className="bg-transparent border-none p-0 text-xs md:text-sm w-28 md:w-40 focus:ring-0 focus:outline-none placeholder-[#896175] dark:text-white" 
            placeholder="Search events..." 
            type="text"
            value={searchQuery !== undefined ? searchQuery : ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        {/* Create Event Button - only explicitly on /dashboard/events */}
        {pathname === "/dashboard/events" && (
          <Link
            href="/dashboard/events/create"
            className="flex items-center gap-1 md:gap-2 bg-[#ee2b8c] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-[10px] md:text-sm hover:bg-[#d6197b] transition-colors shadow-sm"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Create Event</span>
          </Link>
        )}

        {/* Notifications */}
        <OrganizerNotificationBell />
        
        {/* Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-[#f4f0f2] dark:border-[#3a1d2e]">
          <div className="text-right hidden md:block max-w-[120px] lg:max-w-[180px]">
            <p className="text-xs md:text-sm font-bold text-[#181114] dark:text-white truncate" title={user?.organizer?.name}>
              {user?.organizer?.name}
            </p>
            <p className="text-[10px] md:text-xs text-[#896175] truncate" title={user?.name}>
              {user?.name}
            </p>
          </div>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-2 group outline-none"
          >
            <div className="size-8 md:size-10 rounded-full bg-[#ee2b8c] flex items-center justify-center text-white font-bold text-xs md:text-sm overflow-hidden border-2 border-transparent group-hover:border-[#ee2b8c]/20 transition-all">
              {user?.organizer?.logoUrl ? (
                <img src={user.organizer.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.organizer?.name || user?.name)
              )}
            </div>
            <ChevronDownIcon className={`size-4 text-[#896175] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              p: 1.5,
              mt: 1.5,
              minWidth: 220,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              '.dark &': {
                bgcolor: '#221019',
                borderColor: '#3a1d2e',
                color: 'white'
              },
              '& .MuiMenuItem-root': {
                gap: 1.5,
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#ee2b8c10',
                  color: '#ee2b8c'
                }
              }
            }
          }}
        >
          <div className="px-4 py-2 mb-2 lg:hidden">
             <p className="text-xs font-bold text-[#181114] dark:text-white truncate">
              {user?.organizer?.name}
            </p>
            <p className="text-[10px] text-[#896175] truncate">
              {user?.name}
            </p>
          </div>
          
          <Link href="/dashboard/profile">
            <MenuItem onClick={handleClose}>
              <UserIcon className="size-5" />
              My Profile
            </MenuItem>
          </Link>
          
          <Divider className="my-1 border-[#f4f0f2] dark:border-[#3a1d2e]" />
          
          <MenuItem 
            onClick={handleLogout}
            className="text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10"
          >
            <ArrowRightOnRectangleIcon className="size-5" />
            Sign Out
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default DashboardHeader;
