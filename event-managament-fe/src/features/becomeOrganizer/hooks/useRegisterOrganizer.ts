"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { createOrganizer, inviteTeamMember, updateOrganizerLogo } from "../services/organizerService";
import { useStoreLogin } from "../../auth/store/useAuthStore";
import { registerOrganizerSchema } from "../validations/becomeOrganizer.validation";
import Cookies from "js-cookie";

export interface TeamMemberInput {
  email: string;
  role: "ADMIN" | "MARKETING";
}

interface UseRegisterOrganizerProps {
  onSuccess?: () => void;
}

export const useRegisterOrganizer = ({
  onSuccess,
}: UseRegisterOrganizerProps = {}) => {
  const router = useRouter();
  const { accessToken, user, me } = useStoreLogin();
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "MARKETING">("MARKETING");
  
  // Logo & Cropper State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [uncroppedLogoSrc, setUncroppedLogoSrc] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: registerOrganizerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await createOrganizer({
          name: values.name,
          description: values.description || undefined,
        });

        if (result.tokens) {
          Cookies.set("token", result.tokens.accessToken);
          Cookies.set("refreshToken", result.tokens.refreshToken);
        }

        // Upload logo if we have one
        if (result.data?.id && logoFile) {
          try {
             await updateOrganizerLogo(result.data.id, logoFile);
          } catch (err: any) {
             console.warn("Failed to upload logo:", err);
          }
        }

        // Invite team members if any
        if (teamMembers.length > 0 && result.data?.id) {
          const invitePromises = teamMembers.map((member) =>
            inviteTeamMember(result.data.id, { email: member.email, role: member.role }).catch(
              (err: any) => {
                console.warn(`Failed to invite ${member.email}:`, err);
                return null;
              },
            ),
          );
          await Promise.allSettled(invitePromises);
        }

        // Refresh user data to get updated roles
        await me();

        setToastState({
          open: true,
          message: "Organizer profile created! Redirecting...",
          severity: "success",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to create organizer profile";
        setToastState({
          open: true,
          message,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUncroppedLogoSrc(reader.result?.toString() || null);
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (file: File) => {
    setLogoPreviewUrl(URL.createObjectURL(file));
    setLogoFile(file);
    setIsCropperOpen(false);
  };

  const addTeamMember = () => {
    const email = newEmail.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastState({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    if (teamMembers.some((m) => m.email === email)) {
      setToastState({
        open: true,
        message: "This email is already in the list",
        severity: "error",
      });
      return;
    }

    if (teamMembers.length >= 10) {
      setToastState({
        open: true,
        message: "Maximum 10 team members allowed",
        severity: "error",
      });
      return;
    }

    setTeamMembers((prev) => [...prev, { email, role: newRole }]);
    setNewEmail("");
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  return {
    formik,
    isLoading,
    teamMembers,
    newEmail,
    setNewEmail,
    newRole,
    setNewRole,
    addTeamMember,
    removeTeamMember,
    isCropperOpen,
    setIsCropperOpen,
    uncroppedLogoSrc,
    logoPreviewUrl,
    handleLogoChange,
    onCropComplete,
    toast: toastState,
    handleCloseToast,
  };
};
