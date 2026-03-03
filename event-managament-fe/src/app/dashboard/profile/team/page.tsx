import { ManageTeamView } from "@/features/organizerProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Team - Organizer Dashboard",
  description: "View and manage your organization's team members and roles.",
};

export default function ManageTeamPage() {
  return <ManageTeamView />;
}
