import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { updateOrganizerProfile, updateOrganizerLogo } from "../services/profileService";
import { useStoreLogin } from "../../auth/store/useAuthStore";
import { editOrganizerProfileSchema } from "../validations/editOrganizerProfileSchema";

export const useEditOrganizerProfile = () => {
  const router = useRouter();
  const { user, me } = useStoreLogin();
  const organizer = user?.organizer;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(organizer?.logoUrl || null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: organizer?.name || "",
      description: organizer?.description || "",
    },
    validationSchema: editOrganizerProfileSchema,
    onSubmit: async (values) => {
      if (!organizer?.id) return;

      setIsLoading(true);
      setUploadProgress(0);
      try {
        if (logoFile && organizer.id) {
          const formData = new FormData();
          formData.append("image", logoFile);
          await updateOrganizerLogo(organizer.id, formData, (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          });
        }

        await updateOrganizerProfile(organizer.id, {
          name: values.name,
          description: values.description || undefined,
        });

        setToast({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });

        // Refresh user data (background)
        await me();
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile";
          setToast({
            open: true,
            message,
            severity: "error",
          });
        } finally {
          setIsLoading(false);
          setUploadProgress(0);
        }
      },
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // clear value so same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    setLogoFile(croppedFile);
    setLogoPreview(URL.createObjectURL(croppedFile));
  };
  
  const handleCropperClose = () => {
    setIsCropperOpen(false);
    setImageToCrop(null);
  };

  return {
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
    handleCloseToast,
  };
};
