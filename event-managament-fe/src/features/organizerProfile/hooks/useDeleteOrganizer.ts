import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteOrganizerProfile } from "../services/profileService";
import { useStoreLogin } from "../../auth/store/useAuthStore";

export const useDeleteOrganizer = (organizerId: string | undefined) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signOut } = useStoreLogin();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!organizerId) return;
    
    setLoading(true);
    setError(null);
    try {
      await deleteOrganizerProfile(organizerId);
      
      // Successfully deleted. They no longer have an organizer.
      // Easiest stable path is logging them out or forcing a token refresh to update their role back to just CUSTOMER.
      // Here, logging out is the safest method to clear the dual-role caching.
      signOut();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to delete organizer.");
      setLoading(false);
    }
  };

  return {
    open,
    loading,
    error,
    handleOpen,
    handleClose,
    handleDelete,
  };
};
