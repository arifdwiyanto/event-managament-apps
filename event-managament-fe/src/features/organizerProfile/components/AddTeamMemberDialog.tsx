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
  IconButton,
  Select,
  MenuItem
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAddTeamMember } from "../hooks/useAddTeamMember";

interface AddTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({ open, onClose, onSuccess }) => {
  const { formik, isLoading, toast, handleCloseToast } = useAddTeamMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formik.handleSubmit();
    
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
              backgroundImage: 'none'
            },
            '.dark &': {
              bgcolor: '#221019',
              border: '1px solid #3a1d2e'
            }
          }
        }}
      >
        <DialogTitle className="flex items-center justify-between p-6 pb-2">
          <span className="text-xl font-bold dark:text-white">Add Team Member</span>
          <IconButton onClick={onClose} size="small" className="dark:text-slate-400">
            <XMarkIcon className="size-5" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  User Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-slate-50 dark:bg-[#181114]/50 border border-slate-200 dark:border-[#3a1d2e] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b8c] dark:focus:ring-[#ee2b8c] focus:border-transparent transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="e.g. jondoe@example.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  Assign Role *
                </label>
                <Select
                  id="role"
                  fullWidth
                  {...formik.getFieldProps("role")}
                  className="rounded-xl font-semibold text-sm"
                  sx={{ 
                    borderRadius: '12px',
                    bgcolor: 'slate.50',
                    '.dark &': { 
                      bgcolor: '#181114/50',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3a1d2e',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ee2b8c50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ee2b8c',
                      }
                    },
                    '& .MuiSelect-select': { py: 1.5, px: 2 }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '12px',
                        mt: 1,
                        bgcolor: 'white',
                        '.dark &': {
                          bgcolor: '#221019',
                          border: '1px solid #3a1d2e',
                          color: 'white'
                        },
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        '& .MuiMenuItem-root': {
                          fontSize: '13px',
                          fontWeight: 600,
                          py: 1.5,
                          '&.Mui-selected': {
                            bgcolor: '#ee2b8c15',
                            color: '#ee2b8c',
                            '&:hover': {
                              bgcolor: '#ee2b8c25',
                            }
                          },
                          '&:hover': {
                            bgcolor: 'slate.50',
                            '.dark &': { bgcolor: '#ee2b8c10' }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="MARKETING">Marketing (Limited Access)</MenuItem>
                  <MenuItem value="ADMIN">Admin (Can Add/Remove Members)</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role ? (
                  <div className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {formik.errors.role}
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
              {isLoading ? "Inviting..." : "Send Invite"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 2000 }}
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
    </>
  );
};

export default AddTeamMemberDialog;
