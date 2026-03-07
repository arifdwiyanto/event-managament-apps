import { useQuery } from "@tanstack/react-query";
import { userPointService } from "../services/userPointService";

export const useUserPoints = () => {
  return useQuery({
    queryKey: ["userPoints", "balance"],
    queryFn: () => userPointService.getBalance(),
  });
};
