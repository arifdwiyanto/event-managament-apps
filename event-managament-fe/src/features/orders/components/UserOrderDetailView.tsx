"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Order } from "../types/orders.types";
import OrderDetail from "./OrderDetail";

interface UserOrderDetailViewProps {
  order: Order;
}

export default function UserOrderDetailView({ order }: UserOrderDetailViewProps) {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8">
      <button
        onClick={() => router.push("/user/orders")}
        className="flex items-center gap-2 mb-4 md:mb-8 text-gray-500 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors group"
      >
        <ArrowLeftIcon
          className="size-4 group-hover:-translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
        <span className="font-black uppercase text-xs tracking-widest">
          Back to vibes
        </span>
      </button>

      <OrderDetail order={order} />
    </div>
  );
}
