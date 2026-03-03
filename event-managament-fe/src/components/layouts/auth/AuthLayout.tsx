"use client";

import React from "react";
import AuthNavbar from "./AuthNavbar";
import { FloatingThemeToggle } from "@/features/theme";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Text to show before the action button */
  navActionText?: string;
  /** Primary action button text */
  navActionButtonText: string;
  /** Link for the primary action button */
  navActionHref: string;
  /** Whether to use filled style for the action button */
  navActionFilled?: boolean;
  /** Background image URL for the left panel */
  heroImage: string;
  /** Main heading for the left panel */
  heroTitle: React.ReactNode;
  /** Description text for the left panel */
  heroDescription: string;
  /** Optional badge/tag content */
  heroBadge?: React.ReactNode;
  /** Footer content for the hero section (e.g., avatars) */
  heroFooter?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  navActionText,
  navActionButtonText,
  navActionHref,
  navActionFilled = false,
  heroImage,
  heroTitle,
  heroDescription,
  heroBadge,
  heroFooter,
}) => {
  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen lg:h-screen flex flex-col font-[family-name:var(--font-display)] overflow-y-auto lg:overflow-hidden">
    
      <AuthNavbar
        actionText={navActionText}
        actionButtonText={navActionButtonText}
        actionHref={navActionHref}
        actionFilled={navActionFilled}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Hero / Visual */}
        <div className="lg:w-5/12 xl:w-1/2 relative min-h-[180px] md:min-h-[220px] lg:min-h-0 flex-1 flex flex-col justify-end p-4 md:p-6 lg:p-8">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          {/* Overlay Gradient - More neon */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#FF00FF]/10 mix-blend-overlay z-10" />
          
          {/* Scanlines Effect */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            backgroundSize: '100% 4px'
          }} />
          
          {/* Content */}
          <div className="relative z-20 text-white max-w-lg">
            {heroBadge && (
              <div className="mb-2 md:mb-3">
                {heroBadge}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tighter uppercase mb-2 drop-shadow-[2px_2px_0px_#000000]">
              {heroTitle}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 font-bold mb-3 md:mb-4 leading-relaxed max-w-md uppercase tracking-wide">
              {heroDescription}
            </p>
            
            {heroFooter && (
              <div className="flex items-center gap-2 md:gap-3">
                {heroFooter}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Form Content */}
        <div className="lg:w-7/12 xl:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 lg:p-8 bg-white dark:bg-zinc-950 relative overflow-hidden">
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          {children}
           
          {/* Background decorative elements - Neon blobs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-[#FF00FF]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-[#00FFFF]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </main>

      {/* Floating Theme Toggle - Bottom Right */}
      <FloatingThemeToggle />
    </div>
  );
};

export default AuthLayout;
