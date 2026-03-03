import { useState } from "react";
import { updateTeamRole, removeTeamMember } from "../services/teamService";

export const useManageTeam = (
  organizer: any,
  refetch?: () => void
) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const openMenu = Boolean(anchorEl);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<"ADMIN" | "MARKETING">("MARKETING");
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, member: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onOpenDeleteModal = () => {
    setDeleteModalOpen(true);
    handleCloseMenu();
  };

  const onOpenEditRoleModal = () => {
    setNewRole(selectedMember?.role || "MARKETING");
    setEditRoleModalOpen(true);
    handleCloseMenu();
  };

  const handleRemoveMember = async () => {
    if (!selectedMember || !organizer) return;
    setIsLoadingAction(true);
    try {
      await removeTeamMember(organizer.id, selectedMember.id);
      const successMsg = selectedMember.isCurrentUser ? "Left organization successfully!" : "Member removed successfully!";
      setToast({ open: true, message: successMsg, severity: "success" });
      if (refetch) refetch();
    } catch (err: any) {
      setToast({ open: true, message: err.message || "Failed to remove member", severity: "error" });
    } finally {
      setIsLoadingAction(false);
      setDeleteModalOpen(false);
    }
  };

  const handleEditRole = async () => {
    if (!selectedMember || !organizer) return;
    setIsLoadingAction(true);
    try {
      await updateTeamRole(organizer.id, selectedMember.id, newRole);
      setToast({ open: true, message: "Role updated successfully!", severity: "success" });
      if (refetch) refetch();
    } catch (err: any) {
      setToast({ open: true, message: err.message || "Failed to update role", severity: "error" });
    } finally {
      setIsLoadingAction(false);
      setEditRoleModalOpen(false);
    }
  };

  return {
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
  };
};
