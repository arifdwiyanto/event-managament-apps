"use client";

import React from "react";
import DashboardSidebar from "@/components/layouts/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/layouts/dashboard/DashboardHeader";
import { useSidebar } from "@/components/layouts/dashboard/useSidebar";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="bg-[#f8f6f7] dark:bg-[#1a0c13] text-[#181114] dark:text-white font-[family-name:var(--font-display)] min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isOpen} onClose={close} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <DashboardHeader onMenuClick={toggle} />

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </div>
    </div>
  );
}
