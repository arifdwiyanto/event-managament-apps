import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "../validations/auth.validation";
import { useStoreLogin } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const useLoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, accessToken } = useStoreLogin();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const success = await signIn(values);
        if (success) {
          setToast({
            open: true,
            message: "Login Successfully! Redirecting to home...",
            severity: "success",
          });
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setToast({
            open: true,
            message:
              useStoreLogin.getState().error ||
              "Login Failed, please verify your email and password",
            severity: "error",
          });
        }
      } catch (err: any) {
        console.error("Login Error:", err);
        setToast({
          open: true,
          message: "An unexpected error occurred",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return {
    formik,
    showPassword,
    loading,
    toast,
    handleCloseToast,
    togglePasswordVisibility,
  };
};
