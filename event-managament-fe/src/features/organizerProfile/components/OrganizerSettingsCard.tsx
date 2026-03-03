import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDeleteOrganizer } from "../hooks/useDeleteOrganizer";

interface OrganizerSettingsCardProps {
  organizer: any;
  user: any;
}

const OrganizerSettingsCard: React.FC<OrganizerSettingsCardProps> = ({ organizer, user }) => {
  const { open, loading, error, handleOpen, handleClose, handleDelete } = useDeleteOrganizer(organizer?.id);

  // Hide for non-owners, just to be safe on the frontend
  if (organizer?.ownerId !== user?.id) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-500">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Danger Zone</h3>
      </div>

      <div className="bg-white dark:bg-[#221019] border border-red-200 dark:border-red-900/30 rounded-2xl p-8 shadow-sm group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-red-900 dark:text-red-400">Delete Organizer Profile</h4>
            <p className="text-sm text-red-700/80 dark:text-red-300/80 mt-1">
              Once you delete your organizer, there is no going back. Please be certain.
            </p>
          </div>
          <button
            onClick={handleOpen}
            className="px-4 py-2 border border-red-600 text-red-600 dark:text-red-500 dark:border-red-500 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all whitespace-nowrap"
          >
            Delete Organizer
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="font-bold text-red-600">Delete Organizer</DialogTitle>
        <DialogContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <DialogContentText>
            Are you absolutely sure you want to delete <strong>{organizer?.name}</strong>? 
            This action cannot be undone and will permanently remove your organization and teams.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "I understand, Delete."}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrganizerSettingsCard;
