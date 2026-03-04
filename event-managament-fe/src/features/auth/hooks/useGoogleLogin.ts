"use client";

import { useState } from "react";
import { useStoreLogin } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";

export const useGoogleLogin = () => {
  const router = useRouter();
  const { googleSignIn } = useStoreLogin();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) return;

    setLoading(true);
    try {
      const success = await googleSignIn(credentialResponse.credential);
      if (success) {
        setToast({
          open: true,
          message: "Google Login Successfully! Redirecting...",
          severity: "success",
        });
        setTimeout(() => {
          router.push("/");
        }, 200);
      } else {
        setToast({
          open: true,
          message: useStoreLogin.getState().error || "Google Login Failed",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Google Login Error", error);
      setToast({
        open: true,
        message: "An Unexpected error occured during Google Login",
        severity: "error",
      });
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };
  return {
    handleCloseToast,
    handleGoogleSuccess,
    loading,
    toast,
  };
};
