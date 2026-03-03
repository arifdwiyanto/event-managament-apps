import apiFetch from "@/services/apiFetch";

export const getOrganizerProfile = async (id: string) => {
  const response = await apiFetch.get(`/organizations/${id}`);
  return response.data;
};

export const getPublicOrganizerProfile = async (id: string) => {
  const response = await apiFetch.get(`/organizations/public/${id}`);
  return response.data;
};

export const updateOrganizerProfile = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  const response = await apiFetch.patch(`/organizations/${id}`, data);
  return response.data;
};

export const deleteOrganizerProfile = async (id: string) => {
  const response = await apiFetch.delete(`/organizations/${id}`);
  return response.data;
};

export const updateOrganizerLogo = async (
  id: string, 
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
) => {
  const response = await apiFetch.patch(`/organizations/${id}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};
