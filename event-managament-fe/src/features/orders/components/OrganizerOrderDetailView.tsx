"use client";

import React from "react";
import OrganizerOrderDetail from "@/features/orders/components/OrganizerOrderDetail";
import { useGetOrder, usePayOrder } from "@/features/orders/hooks/useOrders";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import { useRouter, useParams } from "next/navigation";

export default function OrganizerOrderDetailView() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const { data: order, isLoading, error } = useGetOrder(orderId);
  const payMutation = usePayOrder();

  const handlePay = async () => {
    if (!order) return;

    try {
      await payMutation.mutateAsync({
        id: order.id,
        payload: {
          method: order.paymentMethod,
        },
      });
    } catch (err: any) {
      alert(err.message || "Failed to process payment");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={{ xs: 4, md: 12 }} minHeight={{ xs: "40vh", md: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3, md: 4 }, width: "100%" }}>
        <Alert severity="error" sx={{ mb: { xs: 3, md: 4 } }}>
          Failed to load transaction. It might not exist or you don't have permission.
        </Alert>
        <Button
          variant="outlined"
          onClick={() => router.push("/dashboard/transactions")}
          startIcon={<ArrowLeftIcon className="w-4 h-4" />}
          fullWidth
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/dashboard/transactions")}
          startIcon={<ArrowLeftIcon className="w-4 h-4" />}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          Back to Transactions
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 1.5, sm: 3, md: 4 }, width: "100%", display: "flex", flexDirection: "column" }}>
      <Button
        onClick={() => router.push("/dashboard/transactions")}
        startIcon={<ArrowLeftIcon className="w-5 h-5 flex-shrink-0" />}
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 }, 
          color: "text.secondary", 
          textTransform: "none", 
          alignSelf: "flex-start",
          fontWeight: 600,
          py: 1,
          px: { xs: 1, sm: 2 }
        }}
        size="small"
      >
        <span className="hidden sm:inline">Back to transactions</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <OrganizerOrderDetail
        order={order}
        isPaying={payMutation.isPending}
        onPay={handlePay}
        isOrganizerView={true}
      />
    </Box>
  );
}
