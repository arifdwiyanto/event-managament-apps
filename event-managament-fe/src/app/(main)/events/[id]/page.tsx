import React from "react";
import EventDetailView from "@/features/events/components/EventDetailView";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  // Destructure id safely as params might be a Promise in Next.js 15+ 
  // but usually it's plain in earlier versions. 
  // Given the earlier files, it seems like a standard Next structure.
  const { id } = await params;
  
  return (
    <div className="bg-background min-h-screen">
      <EventDetailView eventId={id} />
    </div>
  );
};

export default EventDetailPage;
