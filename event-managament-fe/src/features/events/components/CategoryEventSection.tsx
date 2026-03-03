"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton,
  Typography,
  Grid
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { 
  ArrowRightIcon, 
  ArrowUpRightIcon
} from "@heroicons/react/24/solid";
import { CategoryIcon } from "../utils/iconMapping";
import { getContrastColor } from "@/utils/colorUtils";
import { useCategories } from "../hooks";


const CategorySection: React.FC = () => {
  const router = useRouter();
  const { categories, isLoading } = useCategories(5);
  const { categories: allCategories } = useCategories();
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/events?categoryId=${categoryId}`);
  };

  if (isLoading) {
    return (
      <section id="categories" className="py-10 md:py-16 px-4 md:px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div className="h-10 md:h-16 w-48 md:w-96 bg-gray-200 dark:bg-[#222] animate-pulse rounded-sm" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-[#222] animate-pulse rounded-sm" />
        </div>
        <div className="flex lg:grid lg:grid-cols-4 lg:grid-rows-2 overflow-x-auto lg:overflow-x-visible gap-4 md:gap-6 h-auto lg:h-[400px]">
          <div className="flex-shrink-0 w-[280px] sm:w-[400px] lg:w-auto lg:col-span-2 lg:row-span-2 bg-gray-200 dark:bg-[#222] animate-pulse rounded-lg md:rounded-xl" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[200px] sm:w-[250px] lg:w-auto bg-gray-200 dark:bg-[#222] animate-pulse rounded-lg md:rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-10 md:py-16 px-4 md:px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-black uppercase text-gray-900 dark:text-white leading-none">
          Trending <br className="md:block" /> <span className="text-[#00bcd4] dark:text-[#00FFFF]">Categories</span>
        </h2>
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 text-[#ee2b8c] dark:text-[#FF00FF] font-bold uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors group text-xs md:text-sm cursor-pointer"
        >
          View All{" "}
          <span className="group-hover:translate-x-1 transition-transform">
            <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </span>
        </button>
      </div>

      {/* Categories Grid/Scroll Container */}
      <div className="flex lg:grid lg:grid-cols-4 lg:grid-rows-2 overflow-x-auto lg:overflow-x-visible gap-4 md:gap-6 pb-8 lg:pb-0 h-auto lg:h-[400px] snap-x snap-mandatory lg:snap-none custom-horizontal-scrollbar">
        {/* First category - larger on desktop, fixed width on mobile scroll */}
        {categories[0] && (
          <div 
            onClick={() => handleCategoryClick(categories[0].id)}
            className="flex-shrink-0 w-[280px] sm:w-[400px] lg:w-auto lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-lg md:rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer h-[200px] lg:h-full shadow-sm dark:shadow-none snap-start"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70 dark:opacity-90"></div>
            <Image
              alt={categories[0].name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={categories[0].thumbnail || "/placeholder.jpg"}
              fill
            />
            <div className="absolute bottom-0 left-0 p-4 md:p-8 z-20">
              <span
                className="flex items-center gap-1.5 w-fit px-2 md:px-3 py-1 mb-2 md:mb-3 text-[10px] md:text-xs font-black uppercase tracking-wider transform -rotate-2"
                style={{
                  backgroundColor: categories[0].color || "#ee2b8c",
                  color: getContrastColor(categories[0].color || "#ee2b8c")
                }}
              >
                <CategoryIcon iconName={categories[0].icon} className="w-3 h-3 md:w-4 md:h-4" />
                {categories[0].eventCount || 0}+ Events
              </span>
              <h3 className="text-xl md:text-4xl font-display font-black uppercase text-white transition-colors">
                {categories[0].name}
              </h3>
            </div>
            <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <ArrowUpRightIcon className="w-8 h-8 md:w-12 md:h-12" />
              </span>
            </div>
          </div>
        )}

        {/* Other categories */}
        {categories.slice(1).map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex-shrink-0 w-[200px] sm:w-[250px] lg:w-auto relative group overflow-hidden rounded-lg md:rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer h-[200px] lg:h-auto shadow-sm dark:shadow-none snap-start"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70 dark:opacity-90"></div>
            <Image
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={category.thumbnail || "/placeholder.jpg"}
              fill
            />
            <div className="absolute bottom-0 left-0 p-3 md:p-6 z-20">
              <span
                className="flex items-center gap-1 w-fit px-2 py-0.5 md:px-3 md:py-1 mb-1 md:mb-2 text-[9px] md:text-xs font-black uppercase tracking-wider transform rotate-1"
                style={{
                  backgroundColor: category.color || "#ee2b8c",
                  color: getContrastColor(category.color || "#ee2b8c")
                }}
              >
                <CategoryIcon iconName={category.icon} className="w-3 h-3 md:w-4 md:h-4" />
                {category.eventCount || 0}+ Events
              </span>
              <h3 className="text-base md:text-2xl font-display font-black uppercase text-white transition-colors">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* MUI Dialog for All Categories */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          className: "relative !bg-white dark:!bg-[#050505] border-2 border-black dark:border-white/10 rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(0,255,255,0.1)] transition-all overflow-visible",
          style: { margin: '20px', backgroundColor: undefined } // Remove inline background if set
        }}
        slotProps={{
          backdrop: {
            className: "bg-black/60 dark:bg-black/95 backdrop-blur-md"
          }
        }}
      >
        {/* Fixed Absolute Close Button */}
        <IconButton 
          onClick={handleClose} 
          className="absolute top-2 right-2 md:top-4 md:right-4 border-2 border-black dark:border-white/20 text-black dark:text-white rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all p-2 md:p-3 group z-[100] !bg-white dark:!bg-[#050505]"
        >
          <XMarkIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500 text-inherit" />
        </IconButton>

        <DialogTitle className="relative p-10 md:p-16 border-b-2 border-black dark:border-white/10 !bg-white dark:!bg-[#050505] overflow-visible">
          <div className="flex flex-col items-center justify-center relative z-20 text-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 bg-[#ee2b8c] dark:bg-[#FF00FF]"></span>
              <Typography className="font-display font-bold uppercase text-xs md:text-sm tracking-[0.3em] text-[#ee2b8c] dark:text-[#FF00FF]">
                Explore Our
              </Typography>
              <span className="h-[2px] w-8 bg-[#ee2b8c] dark:bg-[#FF00FF]"></span>
            </div>
            <h2 className="font-display font-bold uppercase text-4xl md:text-8xl leading-[0.8] dark:text-white tracking-tighter">
              All <br className="md:hidden" />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#00bcd4] dark:text-[#00FFFF]">Categories</span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#00bcd4]/20 dark:bg-[#00FFFF]/20 -z-10 transform -skew-x-12"></span>
              </span>
            </h2>
          </div>
          
          {/* Decorative Modern Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-black/5 dark:bg-white/5 hidden lg:block"></div>
          <div className="absolute top-10 left-10 w-2 h-2 bg-[#00FFFF] animate-ping opacity-75"></div>
        </DialogTitle>
        <DialogContent className="px-6 md:px-10 pb-10 pt-8 md:pt-12 !bg-white dark:!bg-[#050505] custom-horizontal-scrollbar">
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {allCategories.map((category) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                <div 
                  onClick={() => handleCategoryClick(category.id)}
                  className="group relative h-48 md:h-56 border-2 border-black dark:border-white/10 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(0,255,255,0.4)] hover:-translate-y-1"
                  style={{ backgroundColor: category.color || "#A855F7" }}
                >
                  {/* Category Thumbnail with Modern Overlay */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
                    {category.thumbnail && (
                      <Image
                        src={category.thumbnail}
                        alt={category.name}
                        fill
                        className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 scale-105 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Glass Content Overlay */}
                  <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-between bg-black/5 group-hover:bg-transparent transition-all duration-500">
                    <div className="flex justify-between items-start">
                      <div 
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                      >
                        <CategoryIcon 
                          iconName={category.icon} 
                          className="w-8 h-8 md:w-10 md:h-10 text-white"
                        />
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse"></span>
                        {category.eventCount || 0} Events
                      </div>
                    </div>

                    <div className="relative">
                      <Typography className="font-display font-bold uppercase text-2xl md:text-3xl leading-tight text-white tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        {category.name}
                      </Typography>
                      <div className="w-12 h-1.5 bg-[#00FFFF] mt-3 group-hover:w-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                    </div>
                  </div>

                  {/* Modern Hover UI */}
                  <div className="absolute top-0 right-0 p-4 z-30 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRightIcon className="w-12 h-12 text-white/50" />
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CategorySection;
