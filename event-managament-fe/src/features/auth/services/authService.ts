import apiFetch from "../../../services/apiFetch";
import { SignUp, SignIn } from "../types/auth.types";

export const signUp = async (data: SignUp) => {
  const response = await apiFetch.post("/auth/register", data);
  return response.data;
};

export const signIn = async (data: SignIn) => {
  const response = await apiFetch.post("/auth/login", data);
  return response.data;
};
export const signOut = async () => {
  const response = await apiFetch.post("/auth/logout");
  return response.data;
};
export const getMe = async () => {
  const response = await apiFetch.get("/auth/me");
  return response.data;
};

export const updateUserAvatar = async (
  id: string, 
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
) => {
  const response = await apiFetch.patch(`/users/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};
