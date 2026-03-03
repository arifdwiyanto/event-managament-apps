import apiFetch from "@/services/apiFetch";

export const addTeamMember = async (
  organizerId: string,
  data: { email: string; role: "ADMIN" | "MARKETING" },
) => {
  const response = await apiFetch.post(
    `/organizations/${organizerId}/members`,
    data,
  );
  return response.data;
};

export const updateTeamRole = async (
  organizerId: string,
  userId: string,
  role: "ADMIN" | "MARKETING",
) => {
  const response = await apiFetch.patch(
    `/organizations/${organizerId}/members/${userId}`,
    { role },
  );
  return response.data;
};

export const removeTeamMember = async (
  organizerId: string,
  userId: string,
) => {
  const response = await apiFetch.delete(
    `/organizations/${organizerId}/members/${userId}`,
  );
  return response.data;
};
