import React from "react";
import Link from "next/link";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { getRoleColor, getInitials } from "../utils/teamUtils";

interface TeamCardProps {
  organizer: any;
  user: any;
  refetch?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ organizer, user }) => {
  const apiTeam = organizer?.teams || [];

  // Sort by createdAt (oldest first) and map backend team members
  const sortedTeam = [...apiTeam].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const team = sortedTeam.map((memberData: any) => {
    const member = memberData.user;
    const isCurrentUser = user?.id === member?.id;
    const colors = getRoleColor(memberData.role);
    
    return {
      id: member?.id || Math.random().toString(),
      name: member?.name || "Unknown User",
      role: memberData.role || "MARKETING",
      isCurrentUser,
      ...colors,
    };
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <UserGroupIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            The Team <span className="ml-1 text-slate-400 dark:text-slate-600">({apiTeam.length})</span>
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {team.slice(0, 3).map((member: any) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-3 shadow-sm flex items-center gap-3"
          >
            <div className="size-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-black/30 ring-1 ring-gray-200 dark:ring-[#3a1d2e] flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">
                {getInitials(member.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                  {member.name}
                </p>
                {member.isCurrentUser && (
                 <span className="bg-slate-100 dark:bg-[#2a1621] text-slate-600 dark:text-[#ee2b8c] inline-flex items-center uppercase px-2 py-0.5 rounded text-[10px] font-medium scale-90">
                   You
                 </span>
                )}
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${member.bgColor} ${member.textColor}`}
              >
                {member.role}
              </span>
            </div>
          </div>
        ))}
        {team.length > 3 && (
          <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest py-1">
            + {team.length - 3} more members
          </p>
        )}
      </div>

      <Link 
        href="/dashboard/profile/team"
        className="mt-4 w-full py-2.5 border border-slate-200 dark:border-[#3a1d2e] bg-slate-50 dark:bg-[#221019] text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a1621] transition-all text-center flex items-center justify-center"
      >
        Manage Squad
      </Link>
    </div>
  );
};

export default TeamCard;
