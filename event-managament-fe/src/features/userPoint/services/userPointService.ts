import apiFetch from "@/services/apiFetch";

export const userPointService = {
  getBalance: async (): Promise<number> => {
    const { data } = await apiFetch.get<{ balance: number }>("/user-points/balance");
    return data.balance;
  },
};
