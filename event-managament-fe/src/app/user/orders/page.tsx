"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useGetOrders } from "@/features/orders/hooks/useOrders";
import OrderList from "@/features/orders/components/OrderList";

export default function OrdersPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetOrders({ limit: 50 });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 mb-8 text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
      >
        <ArrowLeftIcon
          className="size-4 group-hover:-translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
        <span className="font-black uppercase text-xs tracking-widest">
          Return to Home
        </span>
      </button>

      <div className="mb-8">
        <Typography
          variant="h3"
          className="font-display font-black uppercase tracking-tighter text-black dark:text-white"
        >
          My <span className="text-neon-pink">Vibes</span>
        </Typography>
        <Typography className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">
          Your transaction history
        </Typography>
      </div>

      {error ? (
        <div className="p-4 border-4 border-red-500 bg-red-50 text-red-600 font-bold uppercase text-center">
          Failed to load orders. Please try again later.
        </div>
      ) : (
        <OrderList orders={data?.data || []} isLoading={isLoading} />
      )}
    </div>
  );
}
