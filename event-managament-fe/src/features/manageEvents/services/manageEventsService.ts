import { format } from "date-fns";
import { manageEventsRepository } from "../repositories/manageEventsRepository";
import {
  ManageEventItem,
  ManageEventsOptions,
} from "../types/manageEvent.types";

function obtainStatus(
  startDate: string,
  endDate: string,
  ticketsSold: number,
  totalTickets: number,
): ManageEventItem["status"] {
  const now = new Date();
  const end = new Date(endDate);

  if (end < now) return "completed";
  if (totalTickets > 0 && ticketsSold >= totalTickets) return "sold-out";
  return "live";
}

export const manageEventsService = {
  getOrganizerEvents: async (
    options: ManageEventsOptions,
  ): Promise<{ events: ManageEventItem[]; meta: any }> => {
    const data = await manageEventsRepository.getOrganizerEvents(options);

    const events: ManageEventItem[] = (data.data ?? []).map((event: any) => {
      const totalTickets = (event.ticketTypes ?? []).reduce(
        (sum: number, t: any) => sum + (Number(t.quota) || 0),
        0,
      );

      const ticketsSold = 0;

      const status = obtainStatus(
        event.startDate,
        event.endDate,
        ticketsSold,
        totalTickets,
      );

      const startDate = new Date(event.startDate);
      const formattedDate = format(startDate, "dd-MMM-yyyy • HH:mm");

      return {
        id: event.id,
        title: event.name,
        category: (event.category?.name ?? "Event").toUpperCase(),
        status,
        date: formattedDate,
        location: event.location ?? "TBA",
        ticketsSold,
        totalTickets,
        image: event.imageUrl ?? undefined,
      } satisfies ManageEventItem;
    });

    return { events, meta: data.meta };
  },
};
