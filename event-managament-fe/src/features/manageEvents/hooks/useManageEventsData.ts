import { useEffect, useState } from "react";
import { Category, CreateEventPayload } from "../types/manageEvent.types";
import { manageEventsRepository } from "../repositories/manageEventsRepository";
import { AxiosError } from "axios";

export const useManageEventsData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await manageEventsRepository.getCategories();
        setCategories(data.data || data);
      } catch (error) {
        setCategoriesError("Failed to load categories");
        console.log(error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createEvent = async (payload: CreateEventPayload, imageFile?: File) => {
    try {
      setIsCreating(true);
      setCreateError(null);

      const formData = new FormData();
      formData.append("organizerId", payload.organizerId);
      formData.append("data", JSON.stringify(payload));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await manageEventsRepository.createEvent(formData);
      return response;
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An unknown error occurred while creating the event";
      setCreateError(errorMsg);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    categories,
    isCategoriesLoading,
    categoriesError,
    createEvent,
    isCreating,
    createError,
  };
};
