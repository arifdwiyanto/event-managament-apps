"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserGroupIcon, 
  ArrowLeftIcon, 
  PlusIcon, 
  EllipsisHorizontalIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  TrashIcon, 
  PencilSquareIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { 
  Menu,
  MenuItem,
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Select, 
  Skeleton,
  Snackbar, 
  Alert, 
  CircularProgress 
} from "@mui/material";
import { FloatingThemeToggle } from "@/features/theme";
import { useOrganizerProfile } from "../hooks/useOrganizerProfile";
import { useManageTeam } from "../hooks/useManageTeam";
import { getRoleColor, getInitials } from "../utils/teamUtils";
import AddTeamMemberDialog from "./AddTeamMemberDialog";

const ManageTeamView: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: organizer, loading, error, user, refetch } = useOrganizerProfile();
  
  const {
    anchorEl,
    selectedMember,
    openMenu,
    handleMenuClick,
    handleCloseMenu,
    deleteModalOpen,
    setDeleteModalOpen,
    onOpenDeleteModal,
    handleRemoveMember,
    editRoleModalOpen,
    setEditRoleModalOpen,
    onOpenEditRoleModal,
    handleEditRole,
    newRole,
    setNewRole,
    isLoadingAction,
    toast,
    handleCloseToast
  } = useManageTeam(organizer, refetch);

  if (loading) {
    return (
      <main 
        className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative"
        style={{
          backgroundImage: 'radial-gradient(circle, #ee2b8c15 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Skeleton variant="text" width={100} height={20} className="mb-2" />
              <Skeleton variant="text" width={250} height={40} />
              <Skeleton variant="text" width={180} height={20} />
            </div>
            <Skeleton variant="rectangular" width={140} height={44} className="rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between">
                  <Skeleton variant="rectangular" width={56} height={56} className="rounded-2xl" />
                  <Skeleton variant="circular" width={32} height={32} />
                </div>
                <div className="space-y-2">
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="40%" height={16} />
                </div>
                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !organizer) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#181114] text-red-500">
        <p>{error || "Organizer profile not found"}</p>
      </div>
    );
  }

  const apiTeam = organizer?.teams || [];
  const teamMembers = apiTeam.map((memberData: any) => {
    const member = memberData.user;
    const isCurrentUser = user?.id === member?.id;
    const colors = getRoleColor(memberData.role);
    
    return {
      id: member?.id || Math.random().toString(),
      name: member?.name || "Unknown User",
      email: member?.email || "No email provided",
      role: memberData.role || "MARKETING",
      isCurrentUser,
      ...colors,
    };
  });

  return (
    <>
      <main 
        className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative"
        style={{
          backgroundImage: 'radial-gradient(circle, #ee2b8c15 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Link 
                href="/dashboard/profile" 
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
              >
                <ArrowLeftIcon className="size-4" />
                Back to Profile
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Manage Team
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                Review and manage members of your organization ({teamMembers.length} members)
              </p>
            </div>

            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ee2b8c] text-white rounded-xl font-bold shadow-lg shadow-[#ee2b8c]/20 hover:bg-[#d41d77] transition-all"
            >
              <PlusIcon className="size-5" />
              Add Member
            </button>
          </div>
{/* Role Privilege Guide */}
          <div className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <ShieldCheckIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">Squad Role Privileges</h2>
                <p className="text-xs md:text-sm text-slate-500">Understand what each member can do in your mission</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  role: "OWNER",
                  icon: <ShieldCheckIcon className="size-5" />,
                  color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
                  desc: "Full legislative & executive power. Can delete the organization, manage all members, and edit core profile settings."
                },
                {
                  role: "ADMIN",
                  icon: <UserIcon className="size-5" />,
                  color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
                  desc: "The high council. Can add or remove members (except Owner), change roles, and manage event operations."
                },
                {
                  role: "MARKETING",
                  icon: <UserGroupIcon className="size-5" />,
                  color: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400",
                  desc: "Operational specialists. Can view team structure and coordinate missions, but cannot change squad composition."
                }
              ].map((item) => (
                <div key={item.role} className="space-y-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider ${item.color}`}>
                    {item.icon}
                    {item.role}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {teamMembers.map((member: any, index: number) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-[#ee2b8c50] transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {getInitials(member.name)}
                      </span>
                    </div>
                    
                    <IconButton 
                      onClick={(e) => handleMenuClick(e as any, member)}
                      className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                      size="small"
                    >
                      <EllipsisHorizontalIcon className="size-5 text-slate-500" />
                    </IconButton>
                  </div>

                  <div className="space-y-1 mb-6 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg truncate flex items-center gap-2">
                        {member.name}
                      </h3>
                      {member.isCurrentUser && (
                        <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800 uppercase tracking-wider">YOU</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <EnvelopeIcon className="size-3.5" />
                      {member.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full border ${member.borderColor} ${member.textColor} ${member.bgColor} flex items-center gap-2 font-semibold text-xs`}>
                      {member.role === "OWNER" || member.role === "ADMIN" ? (
                        <ShieldCheckIcon className="size-3.5" />
                      ) : (
                        <UserIcon className="size-3.5" />
                      )}
                      {member.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        
        </div>

        <footer className="mt-20 pb-8 text-center text-slate-400 dark:text-slate-600">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-600">
            © 2024 Event Platform Organizer. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Menus & Dialogs */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
            mt: 1,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            '& .MuiMenuItem-root': {
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(79, 70, 229, 0.04)',
                color: '#4F46E5',
              }
            }
          }
        }}
      >
        <MenuItem 
          onClick={onOpenEditRoleModal} 
          disabled={selectedMember?.role === "OWNER" || selectedMember?.isCurrentUser}
        >
          Change Role
        </MenuItem>
        <MenuItem 
          onClick={onOpenDeleteModal}
          disabled={selectedMember?.role === "OWNER"}
          className="text-red-600 hover:!bg-red-50"
        >
          {selectedMember?.isCurrentUser ? "Leave Team" : "Remove Member"}
        </MenuItem>
      </Menu>

      <Dialog 
        open={editRoleModalOpen} 
        onClose={() => setEditRoleModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: '24px', padding: '8px', maxWidth: '400px', width: '100%' }
        }}
      >
        <DialogTitle className="font-bold text-xl px-6 pt-6 pb-2">
          Change Role
        </DialogTitle>
        <DialogContent className="px-6 py-4">
          <DialogContentText className="text-sm text-slate-500 mb-6">
            Update permissions for <span className="font-semibold text-slate-900 dark:text-white">{selectedMember?.name}</span>. This will affect what they can access in the dashboard.
          </DialogContentText>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">New Rank</label>
            <Select
              fullWidth
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "ADMIN" | "MARKETING")}
              className="rounded-xl font-semibold text-sm"
              sx={{ 
                borderRadius: '12px',
                bgcolor: 'transparent',
                '& .MuiSelect-select': { py: 1.2, px: 2 }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px',
                    mt: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '& .MuiMenuItem-root': {
                      fontSize: '13px',
                      fontWeight: 600,
                      py: 1.5
                    }
                  }
                }
              }}
            >
              <MenuItem value="MARKETING">Marketing Team</MenuItem>
              <MenuItem value="ADMIN">Organization Admin</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions className="px-6 pb-6 pt-2 gap-3">
          <Button 
            onClick={() => setEditRoleModalOpen(false)} 
            disabled={isLoadingAction}
            className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 text-sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditRole} 
            disabled={isLoadingAction}
            variant="contained"
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm capitalize shadow-none"
          >
            {isLoadingAction ? "Updating..." : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: '24px', padding: '8px', maxWidth: '400px', width: '100%' }
        }}
      >
        <DialogTitle className="font-bold text-xl px-6 pt-6 pb-2 text-red-600">
          Remove Member
        </DialogTitle>
        <DialogContent className="px-6 py-4">
          <DialogContentText className="text-sm text-slate-500 leading-relaxed">
            {selectedMember?.isCurrentUser ? (
              <>
                Are you sure you want to <span className="font-bold text-slate-900 dark:text-white">leave this team</span>?
                <br /><br />
                You will lose access to this organization and all its data. To rejoin, you will need to be re-invited by an Admin or Owner.
              </>
            ) : (
              <>
                Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-white">{selectedMember?.name}</span>? 
                <br/><br/>
                They will lose access to this organization and all its data. This action cannot be undone.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-6 pt-2 gap-3">
          <Button 
            onClick={() => setDeleteModalOpen(false)} 
            disabled={isLoadingAction}
            className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 text-sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRemoveMember} 
            disabled={isLoadingAction}
            variant="contained"
            color="error"
            className="flex-1 py-2.5 font-bold rounded-xl text-sm capitalize shadow-none"
          >
            {isLoadingAction ? (selectedMember?.isCurrentUser ? "Leaving..." : "Removing...") : (selectedMember?.isCurrentUser ? "Leave Team" : "Remove")}
          </Button>
        </DialogActions>
      </Dialog>

      <AddTeamMemberDialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSuccess={refetch}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: "100%", borderRadius: '12px' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageTeamView;
