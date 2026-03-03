import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface AboutOrganizerCardProps {
  organizer: any;
}

const AboutOrganizerCard: React.FC<AboutOrganizerCardProps> = ({ organizer }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
        <InformationCircleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          About Organizer
        </h3>
      </div>
      <div className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-8 shadow-sm space-y-4 flex flex-col min-h-[280px]">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {organizer?.description ||
              "Hype Productions is an event management collective focused on creating high-energy, immersive experiences."}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Our mission is to bridge the gap between digital culture and physical experiences.
          </p>
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-[#3a1d2e]">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
              Founded
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {organizer?.createdAt
                ? new Date(organizer.createdAt).toLocaleDateString("en-US", {
                    month: "long", 
                  })
                : "October 2019"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
              Location
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Jakarta, Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOrganizerCard;
