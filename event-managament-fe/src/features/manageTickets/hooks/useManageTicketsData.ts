import { useEffect, useState } from "react";
import { TicketTierData } from "../types/ticketTierData.types";
import { manageEventsRepository } from "@/features/manageEvents/repositories/manageEventsRepository";

export interface ManageTicketsEventData {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  category?: { name: string };
  status: string;
  ticketsSoldTotal: number;
  ticketsTotalCapacity: number;
  calculatedRevenue: number;
  ticketTiers: TicketTierData[];
}

const tierColors = [
  "#e91e63",
  "#673ab7",
  "#ffc107",
  "#00bcd4",
  "#4caf50",
  "ff9800",
];

export const useManageTicketsData = (eventId: string) => {
  const [data, setData] = useState<ManageTicketsEventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshTicket, setRefreshTicket] = useState(0);

  const refetch = () => setRefreshTicket((prev) => prev + 1);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      setIsLoading(true);
      setError(null);

      try {
        const rawEvent = await manageEventsRepository.getEventById(eventId);

        const now = new Date();
        const end = new Date(rawEvent?.endDate || Date.now());
        let status = "Active Event";
        if (end < now) status = "Completed";

        let ticketsTotalCapacity = 0;
        let calculatedRevenue = 0;
        let ticketsSoldTotal = 0;

        const formattedTiers: TicketTierData[] = (
          rawEvent.ticketTypes || []
        ).map((t: any, index: number) => {
          const capacity = Number(t.quota) || 0;
          const sold = 0;

          ticketsTotalCapacity += capacity;
          ticketsSoldTotal += sold;
          calculatedRevenue += sold * (Number(t.price) || 0);

          let tierStatus: "ACTIVE" | "SOLD OUT" | "PAUSED" = "ACTIVE";
          if (sold >= capacity && capacity > 0) tierStatus = "SOLD OUT";
          if (status === "Completed") tierStatus = "PAUSED";

          const priceNum = Number(t.price) || 0;
          const priceStr =
            priceNum > 0 ? `IDR ${priceNum.toLocaleString()}` : "Free";

          return {
            id: t.id.toString(),
            name: t.name,
            priceStr,
            subtitle:
              t.description ||
              `Sales end ${new Date(rawEvent.startDate).toLocaleDateString()}`,
            status: tierStatus,
            sold,
            total: capacity,
            colorHex: tierColors[index % tierColors.length],
          };
        });

        if (
          ticketsTotalCapacity > 0 &&
          ticketsSoldTotal >= ticketsTotalCapacity
        ) {
          status = "Sold Out";
        }

        setData({
          id: rawEvent.id,
          name: rawEvent.name,
          location: rawEvent.location || "TBA",
          startDate: rawEvent.startDate,
          endDate: rawEvent.endDate,
          imageUrl: rawEvent.imageUrl,
          category: rawEvent.category,
          status,
          ticketsSoldTotal,
          ticketsTotalCapacity,
          calculatedRevenue,
          ticketTiers: formattedTiers,
        });
      } catch (error: any) {
        console.error("Error fetching event tickets data:", error);
        setError(
          error?.response?.data?.message || "Failed to load event data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, refreshTicket]);

  return { data, isLoading, error, refetch };
};
