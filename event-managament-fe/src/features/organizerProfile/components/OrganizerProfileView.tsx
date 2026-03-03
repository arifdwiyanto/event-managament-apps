"use client";

import React from "react";
import { FloatingThemeToggle } from "@/features/theme";
import ProfileContent from "./ProfileContent";

const OrganizerProfileView: React.FC = () => {
  return (
    <main 
      className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50 dark:bg-[#181114] relative"
      style={{
        backgroundImage: 'radial-gradient(circle, #ee2b8c15 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    >
      <ProfileContent />

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
          © 2024 Hype Organizer Dashboard. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default OrganizerProfileView;
