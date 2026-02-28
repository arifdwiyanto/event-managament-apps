import CreateEventView from "@/features/manageEvents/components/CreateEventView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event - Dashboard",
  description: "Create a new event.",
};

const CreateEventPage = () => {
  return <CreateEventView />;
};

export default CreateEventPage;
