
import ManageEventsView from "@/features/manageEvents/components/ManageEventsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Dashboard",
  description: "Manage your events.",
};

const EventPage = () => {
  return (
    <ManageEventsView />
  );
};

export default EventPage;
