import { useState, useEffect } from "react";
import { getPublicOrganizerProfile } from "../services/profileService";

export const usePublicOrganizerProfile = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile from API for ID:", id);
        const result = await getPublicOrganizerProfile(id);
        console.log("Raw API Result:", result);
        
        const finalData = result.data ? result.data : result;
        console.log("Final Data Set:", finalData);
        
        setData(finalData); 
        setError(null);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.message || "Failed to fetch organizer profile");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
};
