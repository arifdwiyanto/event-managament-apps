import { useStoreLogin } from "@/features/auth/store/useAuthStore";

export const useOrgRole = () => {
  const { user } = useStoreLogin();

  if (!user || !user.organizer) return null;

  // The backend returns teams as an array of objects
  const teams = user.organizer.teams;
  
  if (!Array.isArray(teams)) return null;

  const teamMember = teams.find((t) => t.user?.id === user.id);

  return teamMember?.role || null;
};
