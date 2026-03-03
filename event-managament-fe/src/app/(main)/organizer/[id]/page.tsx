import React, { use } from "react";
import PublicOrganizerView from "@/features/organizerProfile/components/PublicOrganizerView";

// Next.js 15+ requires params to be a Promise that must be unwrapped using React.use()
const OrganizerPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <PublicOrganizerView id={resolvedParams.id} />;
};

export default OrganizerPage;
