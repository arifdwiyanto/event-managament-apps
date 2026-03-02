"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Divider,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";

const PAYMENT_METHODS = [
  { id: "BCA_VIRTUAL_ACCOUNT", label: "BCA Virtual Account" },
  { id: "MANDIRI_VIRTUAL_ACCOUNT", label: "Mandiri Virtual Account" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user } = useStoreLogin();
  const createOrderMutation = useCreateOrder();

  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);

  const total = useMemo(() => {
    return (
      cart?.items.reduce((acc, item) => {
        return acc + Number(item.ticketType.price) * item.quantity;
      }, 0) || 0
    );
  }, [cart?.items]);

  const handleCreateOrder = async () => {
    if (!user || !user.id) {
      alert("Please login first");
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const payload = {
        customerId: user.id,
        paymentMethod: selectedPayment,
        items: cart.items.map((item) => ({
          ticketId: item.ticketTypeId,
          qty: item.quantity,
        })),
      };

      const newOrder = await createOrderMutation.mutateAsync(payload);

      await clearCart();

      router.push(`/user/orders/${newOrder.id}`);
    } catch (error: any) {
      console.error("Failed to create order", error);
      alert(error.message || "Failed to create order");
    }
  };

  if (!cart || cart.items.length === 0) {
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
          className="border-2 border-black text-black font-black uppercase rounded-none hover:bg-black hover:text-white"
        >
          Explore Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Typography
        variant="h3"
        className="font-display font-black uppercase tracking-tighter mb-8"
      >
        Checkout
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Typography
              variant="h5"
              className="font-display font-black uppercase mb-4"
            >
              Order Summary
            </Typography>
            <Divider className="border-black border-[1.5px] mb-4" />

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <Typography className="font-bold text-sm uppercase">
                      {item.ticketType.event.name}
                    </Typography>
                    <Typography className="text-xs text-gray-500 uppercase">
                      {item.ticketType.name} x {item.quantity}
                    </Typography>
                  </div>
                  <Typography className="font-black">
                    IDR{" "}
                    {(
                      Number(item.ticketType.price) * item.quantity
                    ).toLocaleString("id-ID")}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <Typography
              variant="h5"
              className="font-display font-black uppercase mb-4"
            >
              Payment Method
            </Typography>
            <Divider className="border-black border-[1.5px] mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border-2 p-4 cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? "border-neon-purple shadow-[4px_4px_0_0_var(--neon-purple)]"
                      : "border-gray-200 hover:border-black"
                  }`}
                >
                  <Typography
                    className={`font-black uppercase text-sm ${selectedPayment === method.id ? "text-neon-purple" : "text-black"}`}
                  >
                    {method.label}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total & Submit */}
        <div className="md:col-span-1">
          <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#0a0a0a] text-white sticky top-24">
            <Typography
              variant="h5"
              className="font-display font-black uppercase mb-4 tracking-tighter"
            >
              Total
            </Typography>
            <Divider className="border-white/20 border-[1.5px] mb-4" />

            <div className="flex justify-between items-center mb-8">
              <Typography className="font-bold uppercase text-sm text-gray-400">
                Amount to pay
              </Typography>
              <Typography className="font-display font-black text-2xl text-neon-cyan">
                IDR {total.toLocaleString("id-ID")}
              </Typography>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={createOrderMutation.isPending}
              className="w-full py-4 bg-neon-purple text-white font-black uppercase tracking-widest shadow-[4px_4px_0_0_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#fff] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrderMutation.isPending
                ? "Processing..."
                : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
