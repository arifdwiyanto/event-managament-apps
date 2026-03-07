"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export const EmptyCart: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Typography
        variant="h5"
        className="font-display font-black uppercase tracking-tighter"
      >
        Your cart is empty
      </Typography>
      <Button
        variant="outlined"
        onClick={() => router.push("/")}
        className="border-2 border-black dark:border-white text-black dark:text-white font-black uppercase rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
      >
        Explore Events
      </Button>
    </div>
  );
};
