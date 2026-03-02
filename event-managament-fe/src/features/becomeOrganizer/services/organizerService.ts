import apiFetch from "../../../services/apiFetch";

export const createOrganizer = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await apiFetch.post("/organizations", data);
  return response.data;
};

export const updateOrganizerLogo = async (
  organizerId: string,
  imageFile: File | Blob,
) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await apiFetch.patch(
    `/organizations/${organizerId}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const inviteTeamMember = async (
  organizerId: string,
  data: { email: string; role?: "ADMIN" | "MARKETING" },
) => {
  const response = await apiFetch.post(
    `/organizations/${organizerId}/members`,
    data,
  );
  return response.data;
};
