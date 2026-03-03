"use client";

import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Snackbar, 
  Alert,
  IconButton
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEditOrganizerProfile } from "../hooks/useEditOrganizerProfile";
import { ImageCropperModal } from "@/features/imageCropper/components/ImageCropperModal";

interface EditOrganizerProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditOrganizerProfileDialog: React.FC<EditOrganizerProfileDialogProps> = ({ open, onClose, onSuccess }) => {
  const { 
    formik, 
    isLoading, 
    toast, 
    logoPreview, 
    imageToCrop,
    isCropperOpen,
    uploadProgress,
    handleLogoChange, 
    handleCropComplete,
    handleCropperClose,
    handleCloseToast 
  } = useEditOrganizerProfile();

  // Wrap the submit handler to close dialog on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formik.handleSubmit();
    
    // If submission was successful (no errors and not loading anymore)
    if (formik.isValid && !formik.isSubmitting) {
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            bgcolor: 'white',
            '&.MuiPaper-root': {
              backgroundImage: 'none' // Remove MUI dark mode overlay
            },
            '.dark &': {
              bgcolor: '#221019',
              border: '1px solid #3a1d2e'
            }
          }
        }}
      >
        <DialogTitle className="flex items-center justify-between p-6">
          <span className="text-xl font-bold dark:text-white">Edit Organizer Profile</span>
          <IconButton onClick={onClose} size="small" className="dark:text-slate-400">
            <XMarkIcon className="size-5" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent className="p-6 pt-0 space-y-6">
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative group">
                <div className="size-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#3a1d2e] overflow-hidden bg-slate-50 dark:bg-[#181114] flex flex-col items-center justify-center transition-all group-hover:border-[#ee2b8c] dark:group-hover:border-[#ee2b8c] relative">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                    </span>
                  )}

                  {isLoading && uploadProgress > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                      <span className="text-white font-black text-2xl drop-shadow-md">
                        {uploadProgress}%
                      </span>
                      <span className="text-white/80 text-[10px] font-bold uppercase mt-1">Uploading</span>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-20">
                  <span className="material-symbols-outlined mb-1">upload</span>
                  <span className="text-xs font-semibold">Change Logo</span>
                  <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={handleLogoChange} />
                </label>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Recommended: Square 500x500px • Max 2MB <br />
                (JPEG, PNG, WEBP)
              </p>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  Organizer Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-slate-50 dark:bg-[#181114]/50 border border-slate-200 dark:border-[#3a1d2e] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b8c] dark:focus:ring-[#ee2b8c] focus:border-transparent transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="Enter organizer name"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  Description / About Us
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-[#181114]/50 border border-slate-200 dark:border-[#3a1d2e] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b8c] dark:focus:ring-[#ee2b8c] focus:border-transparent transition-all placeholder-slate-400 dark:placeholder-slate-600 resize-none"
                  placeholder="Tell us about what kind of events you organize..."
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>

          <DialogActions className="p-6 pt-2 gap-3">
            <Button 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 text-sm capitalize"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              variant="contained"
              className="flex-[2] py-3 bg-[#ee2b8c] hover:bg-[#d41d77] text-white font-bold rounded-xl text-sm capitalize shadow-none transition-all"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 2000 }} // Ensure it's above the dialog
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: '12px' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <ImageCropperModal
        open={isCropperOpen}
        imageSrc={imageToCrop}
        onClose={handleCropperClose}
        onCropComplete={handleCropComplete}
        title="Crop Organizer Logo"
        aspectRatio={1} // Square crop
      />
    </>
  );
};

export default EditOrganizerProfileDialog;
