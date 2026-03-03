"use client";

import React from "react";
import HeroSection from "./HeroSection";
import WhyHypeSection from "./WhyHypeSection";
import DashboardPreviewSection from "./DashboardPreviewSection";
import SuccessStoriesSection from "./SuccessStoriesSection";
import StickyCtaBar from "./StickyCtaBar";
import { MainNavbar, MainFooter } from "../../../components/layouts/home";

const BecomeOrganizerView: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-body min-h-screen flex flex-col selection:bg-[#ee2b8c] dark:selection:bg-[#FF00FF] selection:text-white dark:selection:text-black">

      
      <main className="flex-1 flex flex-col w-full overflow-x-hidden ">
        {/* Hero */}
        <HeroSection />

        {/* Why Hype? Feature Cards */}
        <WhyHypeSection />

        {/* Dashboard Preview */}
        <DashboardPreviewSection />

        {/* Success Stories */}
        <SuccessStoriesSection />

        {/* Sticky CTA */}
        <StickyCtaBar />
      </main>
    </div>
  );
};

export default BecomeOrganizerView;
