import React from "react";
import EventDetailView from "@/features/events/components/EventDetailView";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { id } = await params;
  
  return (
    <div className="bg-background min-h-screen">
      <EventDetailView eventId={id} />
    </div>
  );
};

export default EventDetailPage;
