import ManageTicketsView from "@/features/manageTickets/components/ManageTicketsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Tickets - Dashboard",
  description: "Manage ticket inventory and pricing for your event.",
};

const ManageTicketsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ManageTicketsView eventId={id} />;
};

export default ManageTicketsPage;
