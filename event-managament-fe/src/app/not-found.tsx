"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-pink/20 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-xl w-full text-center relative z-10 flex flex-col items-center">
        {/* Animated 404 Header */}
        <motion.h1 
          className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Glitch Effect Divider (Brutalist Touch) */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-2 w-32 bg-foreground my-8"
        />

        <motion.h2 
          className="text-2xl md:text-4xl font-bold mb-4 font-display text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Whoops! Page Not Found
        </motion.h2>

        <motion.p 
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          It seems you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Neo-brutalist return buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <button 
            onClick={() => router.back()}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-foreground bg-transparent border-2 border-foreground hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_0_currentColor] hover:shadow-[6px_6px_0_0_currentColor] transition-all duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="uppercase tracking-wider">Go Back</span>
          </button>

          <Link 
            href="/"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-background bg-foreground border-2 border-foreground hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_0_currentColor] hover:shadow-[6px_6px_0_0_currentColor] transition-all duration-200"
          >
            <span className="mr-2 uppercase tracking-wider">Back to Home</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
