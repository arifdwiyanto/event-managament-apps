import apiFetch from "@/services/apiFetch";
import { CreateReviewPayload, ReviewResponse } from "../types/reviews.types";

export const createReview = async (payload: CreateReviewPayload) => {
  const response = await apiFetch.post("/reviews", payload);
  return response.data;
};

export const getReviewsByEvent = async (
  eventId: string,
  page = 1,
  limit = 10,
): Promise<ReviewResponse> => {
  const response = await apiFetch.get(`/reviews/event/${eventId}`, {
    params: { page, limit },
  });
  return response.data;
};
