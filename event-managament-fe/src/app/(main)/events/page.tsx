import React, { Suspense } from "react";
import { Metadata } from "next";
import EventExplorerPageView from "@/features/events/components/EventExplorerPageView";

export const metadata: Metadata = {
  title: "Explore All Vibes | VibePass",
  description: "Discover the best music, workshops, nightlife, and art events in your city. Find your next experience and secure your spot on VibePass.",
};

export default function EventExplorerPage() {
  return (
    <Suspense fallback={<div />}> 
      <EventExplorerPageView />
    </Suspense>
  );
}
