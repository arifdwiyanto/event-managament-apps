import { useState, useEffect } from "react";
import { getOrganizerProfile } from "../services/profileService";
import { useStoreLogin } from "../../auth/store/useAuthStore";

export const useOrganizerProfile = () => {
  const { user } = useStoreLogin();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const organizerId = user?.organizer?.id;

  const fetchProfile = async (silent = false) => {
    if (!silent) setLoading(true);
    if (!organizerId) {
      setLoading(false);
      return;
    }

    try {
      const result = await getOrganizerProfile(organizerId);
      setData(result.data); // Assuming result has a .data property based on original code
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch organizer profile");
      setData(null);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [organizerId, user]);

  return {
    data,
    loading,
    error,
    user,
    refetch: () => fetchProfile(true),
  };
};
