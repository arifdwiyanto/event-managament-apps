"use client";

import OrderDetail from "@/features/orders/components/OrderDetail";
import { useGetOrder } from "@/features/orders/hooks/useOrders";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useGetOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Typography className="font-display font-black uppercase text-xl animate-pulse">
          Loading vibe details...
        </Typography>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="p-6 border-4 border-red-500 bg-red-50 text-red-600 font-bold uppercase text-center mb-6">
          Failed to load transaction. It might not exist or you don't have
          permission.
        </div>
        <button
          onClick={() => router.push("/dashboard/transactions")}
          className="border-2 border-black px-6 py-2 font-black uppercase"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button
        onClick={() => router.push("/dashboard/transactions")}
        className="flex items-center gap-2 mb-8 text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
      >
        <ArrowLeftIcon
          className="size-4 group-hover:-translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
        <span className="font-black uppercase text-xs tracking-widest">
          Back to transactions
        </span>
      </button>

      <OrderDetail
        order={order}
        isOrganizerView={true}
      />
    </div>
  );
}
