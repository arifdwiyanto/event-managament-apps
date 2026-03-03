"use client";

import React from "react";
import Link from "next/link";

interface AuthNavbarProps {
  /** Text to show before the action button */
  actionText?: string;
  /** Primary action button text */
  actionButtonText: string;
  /** Link for the primary action button */
  actionHref: string;
  /** Whether to use filled style for the action button */
  actionFilled?: boolean;
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({
  actionText,
  actionButtonText,
  actionHref,
  actionFilled = false,
}) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b-2 border-gray-200 dark:border-zinc-800 px-3 md:px-6 lg:px-10 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 relative flex-shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 md:gap-3">
        <div className="size-6 md:size-8 text-[#ee2b8c] dark:text-[#FF00FF] animate-pulse">
          <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(238,43,140,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-base md:text-xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[#ee2b8c] to-[#d61f7a] dark:from-[#FF00FF] dark:to-[#B026FF] pr-1 pb-1">
          Hype
        </h2>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 font-display tracking-wide uppercase text-[10px] lg:text-xs font-bold">
          <Link href="/events" className="text-[#ee2b8c] dark:text-[#00FFFF] hover:drop-shadow-[0_0_5px_currentColor] transition-all">
            Events
          </Link>
          <Link href="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-[#ee2b8c] dark:hover:text-[#FF00FF] transition-colors">
            Marketplace
          </Link>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          {actionText && (
            <span className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 hidden sm:block uppercase tracking-wide">{actionText}</span>
          )}
          <Link 
            href={actionHref} 
            className={`flex min-w-[60px] md:min-w-[80px] cursor-pointer items-center justify-center h-7 md:h-8 px-3 md:px-4 transition-all text-[10px] md:text-xs font-black uppercase tracking-wider ${
              actionFilled 
                ? "bg-[#ee2b8c] dark:bg-[#FF00FF] text-white dark:text-black border-2 border-black shadow-[2px_2px_0px_0px_#d61f7a] dark:shadow-[2px_2px_0px_0px_#B026FF] hover:shadow-[3px_3px_0px_0px_#d61f7a] dark:hover:shadow-[3px_3px_0px_0px_#B026FF] hover:-translate-y-0.5" 
                : "bg-white dark:bg-black border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-black"
            }`}
          >
            <span className="truncate">{actionButtonText}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
