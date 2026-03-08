"use client";

import React from "react";
import EventFilters from "./EventFilters";
import EventInfiniteGrid from "./EventInfiniteGrid";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useEventExplorer } from "../hooks";
import { Snackbar, Alert } from "@mui/material";

const EventExplorerPageView: React.FC = () => {
  const {
    filters,
    isFilterOpen,
    isMenuOpen,
    resolvedTheme,
    toggleTheme,
    toast,
    handleShowToast,
    handleCloseToast,
    setIsFilterOpen,
    setIsMenuOpen,
  } = useEventExplorer();

  const actions = [
    {
      icon: <AdjustmentsHorizontalIcon className="size-5" />,
      name: "Filters",
      onClick: () => {
        setIsFilterOpen(true);
        setIsMenuOpen(false);
      },
      color: "var(--neon-cyan)",
    },
    {
      icon:
        resolvedTheme === "dark" ? (
          <SunIcon className="size-5" />
        ) : (
          <MoonIcon className="size-5" />
        ),
      name: "Theme",
      onClick: () => {
        toggleTheme();
        setIsMenuOpen(false);
      },
      color: "var(--neon-purple)",
    },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20, scale: 0.8 },
    open: { opacity: 1, x: 0, scale: 1 },
  };

  return (
    <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto text-foreground transition-colors duration-300 selection:bg-neon-pink selection:text-black min-h-screen">
      {/* Hero Section */}
      <section className="px-5 md:px-8 lg:px-10 pt-8 md:pt-16 pb-6 md:pb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] -z-10 rounded-full md:hidden"></div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black tracking-tighter leading-[0.9] uppercase italic py-2">
          EXPLORE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-gray-400 to-neon-pink dark:via-white drop-shadow-[0_0_15px_rgba(0,255,255,0.4)] pr-4 break-words">
            ALL VIBES
          </span>
        </h1>
      </section>

      {/* Explorer Layout */}
      <div className="flex flex-col lg:flex-row px-5 md:px-8 lg:px-10 gap-8 lg:gap-10 pb-20 relative">
        {/* Mobile Filter Overlay */}
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden transition-all duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className={`absolute right-0 top-0 h-full w-full bg-background border-l-2 border-neon-cyan/30 p-6 overflow-y-auto transition-transform duration-300 transform ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display font-black text-2xl uppercase italic text-neon-cyan">
                Filters
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-none border-2 border-gray-200 dark:border-gray-700"
              >
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <EventFilters {...filters} />
          </div>
        </div>

        {/* Desktop Filter Aside */}
        <div className="hidden lg:block">
          <EventFilters {...filters} />
        </div>

        {/* Grid Content */}
        <div className="flex-1 min-w-0">
          <EventInfiniteGrid {...filters} onToast={handleShowToast} />
        </div>

        {/* Custom Mobile Page Controls - Hidden on Desktop */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="flex flex-col items-end gap-3 mb-2"
              >
                {actions.map((action) => (
                  <motion.button
                    key={action.name}
                    variants={itemVariants}
                    onClick={action.onClick}
                    className="flex items-center gap-3 group"
                  >
                    <span className="bg-black text-white dark:bg-white dark:text-black py-1.5 px-3 text-[10px] font-black uppercase tracking-widest border border-white/10 dark:border-black/10 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(0,255,255,0.2)]">
                      {action.name}
                    </span>
                    <div
                      className="size-12 rounded-none bg-background border-2 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                      style={{ borderColor: action.color }}
                    >
                      <div
                        className="transition-colors group-hover:text-white"
                        style={{ color: action.color }}
                      >
                        {action.icon}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`size-14 rounded-none flex items-center justify-center transition-all duration-300 border-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
              isMenuOpen
                ? "bg-neon-pink border-black text-black rotate-90"
                : "bg-neon-cyan border-black text-black"
            }`}
          >
            {isMenuOpen ? (
              <XMarkIcon className="size-8" strokeWidth={3} />
            ) : (
              <SparklesIcon className="size-8" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Global Explorer Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 0,
            border: "3px solid black",
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
            fontWeight: "900",
            textTransform: "uppercase",
            fontSize: "12px",
            bgcolor:
              toast.severity === "success"
                ? "#00FFDD !important"
                : "#FF0055 !important",
            color:
              toast.severity === "success"
                ? "black !important"
                : "white !important",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default EventExplorerPageView;
