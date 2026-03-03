"use client";

import React, { useEffect, useState } from "react";
import { useFilterBar } from "../hooks";

// Search Icon
const SearchIcon = () => (
  <svg
    className="w-5 h-5 md:w-8 md:h-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const trendingTags = [
  { id: "1", label: "#TechnoBunker" },
  { id: "2", label: "#PotteryJam" },
  { id: "3", label: "#IndieFest" },
];

const HeroSection: React.FC = () => {
  const { activeSearch, setSearch } = useFilterBar();
  const [inputValue, setInputValue] = useState(activeSearch);

  useEffect(() => {
    setInputValue(activeSearch);
  }, [activeSearch]);

  const scrollToEvents = () => {
    const eventsGrid = document.getElementById("events-grid");
    if (eventsGrid) {
      const y = eventsGrid.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== activeSearch) {
        setSearch(inputValue);
        if (inputValue.trim() !== "") {
          scrollToEvents();
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, activeSearch, setSearch]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSearch(inputValue);
    if (inputValue.trim() !== "") {
      scrollToEvents();
    }
  };

  return (
    <section className="relative py-12 md:py-24 px-4 md:px-6 lg:px-10 border-b border-gray-200 dark:border-[#222] bg-gradient-to-b from-gray-50 to-white dark:from-[#050505] dark:to-[#0a0a0a]">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-10 w-20 md:w-32 h-20 md:h-32 bg-[#ee2b8c] dark:bg-[#B026FF] rounded-full blur-[80px] md:blur-[100px] opacity-20 dark:opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-32 md:w-64 h-32 md:h-64 bg-[#00bcd4] dark:bg-[#00FFFF] rounded-full blur-[100px] md:blur-[120px] opacity-15 dark:opacity-20 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-10 relative z-10">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] uppercase transform -rotate-1">
          Find Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bcd4] via-[#ee2b8c] to-[#9c27b0] dark:from-[#00FFFF] dark:via-white dark:to-[#FF00FF] drop-shadow-[0_0_20px_rgba(0,188,212,0.3)] dark:drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
            Vibe
          </span>{" "}
          Now
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light border-l-4 border-[#ee2b8c] dark:border-[#FF00FF] pl-4 md:pl-6 text-left md:text-center md:border-l-0 md:pl-0">
          Stop scrolling. Start experiencing. The sickest workshops, raves, and
          underground gigs are right here.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto w-full group transform hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none z-10">
            <span className="text-[#00bcd4] dark:text-[#00FFFF] group-focus-within:text-[#ee2b8c] dark:group-focus-within:text-[#FF00FF] transition-colors">
              <SearchIcon />
            </span>
          </div>
          <input
            className="block w-full pl-12 md:pl-16 pr-20 md:pr-40 py-4 md:py-6 bg-white dark:bg-black/60 backdrop-blur-xl border-2 border-[#ee2b8c] dark:border-[#B026FF] focus:border-[#00bcd4] dark:focus:border-[#00FFFF] focus:ring-4 focus:ring-[#00bcd4]/20 dark:focus:ring-[#00FFFF]/20 rounded-none text-base md:text-xl lg:text-2xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all shadow-[0_0_20px_rgba(238,43,140,0.1)] dark:shadow-[0_0_20px_rgba(176,38,255,0.2)] focus:shadow-[0_0_40px_rgba(0,188,212,0.2)] dark:focus:shadow-[0_0_40px_rgba(0,255,255,0.3)] font-display uppercase tracking-wide outline-none"
            placeholder="Search..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 bg-[#00bcd4] dark:bg-[#00FFFF] hover:bg-[#ee2b8c] dark:hover:bg-[#FF00FF] text-white dark:text-black px-4 md:px-8 rounded-none font-bold text-sm md:text-lg uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000]"
          >
            GO
          </button>
        </form>

        {/* Trending Tags */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-2 md:pt-4">
          <span className="px-2 md:px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs uppercase tracking-widest rounded-sm">
            Trending:
          </span>
          {trendingTags.map((tag) => (
            <a
              key={tag.id}
              href="#"
              className="text-[#ee2b8c] dark:text-[#FF00FF] hover:underline decoration-wavy underline-offset-4 decoration-[#00bcd4] dark:decoration-[#00FFFF] text-xs md:text-sm font-bold uppercase"
            >
              {tag.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
