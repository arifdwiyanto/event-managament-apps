import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateReviewPayload } from "../types/reviews.types";
import { createReview, getReviewsByEvent } from "../services/reviews.service";

export const useCreateReview = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      options?.onError?.(error);
    },
  });
};

export const useEventReviews = (eventId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", eventId, page, limit],
    queryFn: () => getReviewsByEvent(eventId, page, limit),
    enabled: !!eventId,
  });
};
