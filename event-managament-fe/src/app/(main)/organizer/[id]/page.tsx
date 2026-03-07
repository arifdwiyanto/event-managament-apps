import { use } from "react";
import PublicOrganizerView from "@/features/organizerProfile/components/PublicOrganizerView";

const OrganizerPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <PublicOrganizerView id={resolvedParams.id} />;
};

export default OrganizerPage;
