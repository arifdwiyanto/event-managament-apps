"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Squares2X2Icon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  XMarkIcon,
  RocketLaunchIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { id: "events", label: "My Events", href: "/dashboard/events", icon: CalendarIcon },
  { id: "transactions", label: "Transactions", href: "/dashboard/transactions", icon: CreditCardIcon },
  { id: "reports", label: "Reports", href: "/dashboard/reports", icon: ChartBarIcon },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#f4f0f2] dark:border-[#3a1d2e]">
        <div className="size-8 text-[#ee2b8c]">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#181114] dark:text-white">Hype</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-[#ee2b8c]/10 text-[#ee2b8c] font-bold"
                  : "text-[#5f4351] dark:text-gray-400 hover:bg-[#f8f6f7] dark:hover:bg-[#2a1621] hover:text-[#181114] dark:hover:text-white"
              }`}
            >
            <Icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>

    {/* Pro Plan Card */}
    <div className="p-4 border-t border-[#f4f0f2] dark:border-[#3a1d2e]">
      <Link href="/">
        <div className="bg-gradient-to-br from-[#10b981]/10 to-[#3b82f6]/10 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
          <div className="relative z-10">
            <p className="text-xs font-bold text-[#10b981] mb-1">BACK TO MAIN</p>
            <p className="text-sm font-semibold text-[#181114] dark:text-white">Go to Home</p>
            <div className="mt-3 text-xs font-bold text-[#3b82f6] flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse Events <ChevronRightIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-[#10b981]/10 rotate-12">
            <RocketLaunchIcon className="w-12 h-12" />
          </div>
        </div>
      </Link>
    </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#221019] border-r border-[#f4f0f2] dark:border-[#3a1d2e] hidden lg:flex flex-col flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={onClose}
            />
            
            {/* Sidebar */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-64 bg-white dark:bg-[#221019] flex flex-col z-50 shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#5f4351] hover:text-[#181114] dark:hover:text-white bg-[#f4f0f2] dark:bg-[#2a1621] rounded-xl transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
