"use client";

import React from "react";
import { usePagination } from "../hooks";

// Arrow Icons
const ArrowBackIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const ArrowForwardIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);

interface PaginationBarProps {
  totalPages: number;
}

const PaginationBar: React.FC<PaginationBarProps> = ({ totalPages }) => {
  const { currentPage, goToPage, nextPage, prevPage, isFirstPage, isLastPage } =
    usePagination(totalPages);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <section className="pb-8 md:pb-16 pt-4 md:pt-8 flex justify-center">
      <nav aria-label="Pagination">
        <ul className="flex items-center space-x-1 md:space-x-2">
          {/* Previous Button */}
          <li>
            <button
              onClick={prevPage}
              disabled={isFirstPage}
              className="flex items-center justify-center w-7 h-7 md:w-12 md:h-12 text-[#ee2b8c] dark:text-[#FF00FF] bg-transparent border-2 border-[#ee2b8c] dark:border-[#FF00FF] rounded-none hover:bg-[#ee2b8c] dark:hover:bg-[#FF00FF] hover:text-white dark:hover:text-black transition-all shadow-[2px_2px_0px_0px_#d61f7a] md:shadow-[4px_4px_0px_0px_#d61f7a] dark:shadow-[2px_2px_0px_0px_#B026FF] dark:md:shadow-[4px_4px_0px_0px_#B026FF] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ArrowBackIcon />
            </button>
          </li>

          {/* Page Number */}
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <li
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400 dark:text-gray-600 font-bold"
                >
                  ...
                </li>
              );
            }

            const pageNum = page as number;
            return (
              <li key={pageNum}>
                <button
                  onClick={() => goToPage(pageNum)}
                  className={`flex items-center justify-center w-7 h-7 md:w-12 md:h-12 font-bold text-xs md:text-lg border-2 transition-all ${
                    currentPage === pageNum
                      ? "text-white dark:text-black bg-[#00bcd4] dark:bg-[#00FFFF] border-[#00bcd4] dark:border-[#00FFFF] shadow-[2px_2px_0px_0px_#0097a7] md:shadow-[4px_4px_0px_0px_#0097a7] dark:shadow-[2px_2px_0px_0px_#000] dark:md:shadow-[4px_4px_0px_0px_#000]"
                      : "text-gray-500 dark:text-gray-400 bg-transparent border-gray-300 dark:border-gray-700 hover:border-[#00bcd4] dark:hover:border-[#00FFFF] hover:text-[#00bcd4] dark:hover:border-[#00FFFF]"
                  }`}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          {/* Next Button */}
          <li>
            <button
              onClick={nextPage}
              disabled={isLastPage}
              className="flex items-center justify-center w-7 h-7 md:w-12 md:h-12 text-[#ee2b8c] dark:text-[#FF00FF] bg-transparent border-2 border-[#ee2b8c] dark:border-[#FF00FF] rounded-none hover:bg-[#ee2b8c] dark:hover:bg-[#FF00FF] hover:text-white dark:hover:text-black transition-all shadow-[2px_2px_0px_0px_#d61f7a] md:shadow-[4px_4px_0px_0px_#d61f7a] dark:shadow-[2px_2px_0px_0px_#B026FF] dark:md:shadow-[4px_4px_0px_0px_#B026FF] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ArrowForwardIcon />
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default PaginationBar;
