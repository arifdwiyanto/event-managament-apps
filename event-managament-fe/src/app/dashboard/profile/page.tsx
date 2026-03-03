import { OrganizerProfileView } from "@/features/organizerProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Profile - Dashboard",
  description: "Manage your organizer profile, team, and public page visibility.",
};

export default function ProfilePage() {
  return <OrganizerProfileView />;
}
