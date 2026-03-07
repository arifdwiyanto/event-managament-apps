"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Divider, Button } from "@mui/material";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { useValidatePromotion } from "@/features/promotions/hooks/usePromotions";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user } = useStoreLogin();
  const createOrderMutation = useCreateOrder();
  const validatePromoMutation = useValidatePromotion();

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    id: string;
    discount: number;
    code: string;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  const total = useMemo(() => {
    return (
      cart?.items.reduce((acc, item) => {
        return acc + Number(item.ticketType.price) * item.quantity;
      }, 0) || 0
    );
  }, [cart?.items]);

  const handleApplyPromo = async () => {
    setPromoError("");
    if (!promoCode.trim()) return;

    try {
      const result = await validatePromoMutation.mutateAsync({
        code: promoCode,
        userId: user?.id,
        eventId: cart?.items[0]?.ticketType?.eventId,
      });

      if (result.valid) {
        const promo = result.promotion;
        let discountVal = 0;
        if (promo.discountPercentage) {
          discountVal = (total * Number(promo.discountPercentage)) / 100;
        } else if (promo.discountAmount) {
          discountVal = Number(promo.discountAmount);
        }

        setAppliedPromo({
          id: promo.id,
          code: promo.code,
          discount: discountVal,
        });
        setPromoCode("");
      }
    } catch (error: any) {
      setPromoError(
        error?.response?.data?.message || error.message || "Invalid promo code",
      );
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const finalTotal = Math.max(0, total - (appliedPromo?.discount || 0));

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
      setIsProcessing(true);

      const payload = {
        customerId: user.id,
        paymentMethod: "MIDTRANS",
        promotionId: appliedPromo ? appliedPromo.id : undefined,
        items: cart.items.map((item) => ({
          ticketId: item.ticketTypeId,
          qty: item.quantity,
        })),
      };

      const newOrder = await createOrderMutation.mutateAsync(payload);

      await clearCart();

      if (newOrder.snapToken && (window as any).snap) {
        (window as any).snap.pay(newOrder.snapToken, {
          onSuccess: function () {
            router.push(`/user/orders/${newOrder.id}`);
          },
          onPending: function () {
            router.push(`/user/orders/${newOrder.id}`);
          },
          onError: function () {
            alert("Payment failed or encountered an error");
            router.push(`/user/orders/${newOrder.id}`);
          },
          onClose: function () {
            router.push(`/user/orders/${newOrder.id}`);
          },
        });
      } else {
        router.push(`/user/orders/${newOrder.id}`);
      }
    } catch (error: any) {
      console.error("Failed to create order", error);
      alert(error.message || "Failed to create order");
    } finally {
      setIsProcessing(false);
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

          {/* Promo Code */}
          <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <Typography
              variant="h5"
              className="font-display font-black uppercase mb-4"
            >
              Have a Promo Code?
            </Typography>
            <Divider className="border-black border-[1.5px] mb-4" />

            {appliedPromo ? (
              <div className="flex items-center justify-between bg-neon-cyan/20 p-4 border-2 border-neon-cyan">
                <div>
                  <Typography className="font-bold uppercase text-neon-cyan/80 text-xs mb-1">
                    Promo Applied
                  </Typography>
                  <Typography className="font-black uppercase text-xl">
                    {appliedPromo.code}
                  </Typography>
                </div>
                <div className="flex items-center gap-4">
                  <Typography className="font-bold text-neon-cyan uppercase">
                    - IDR {appliedPromo.discount.toLocaleString("id-ID")}
                  </Typography>
                  <button
                    onClick={handleRemovePromo}
                    className="text-xs font-bold underline text-red-500 hover:text-red-700"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="flex-1 border-2 border-black px-4 py-3 font-bold uppercase placeholder:text-gray-400 focus:outline-none focus:border-neon-purple transition-colors"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={
                      !promoCode.trim() || validatePromoMutation.isPending
                    }
                    className="px-6 border-2 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-neon-purple hover:border-neon-purple transition-colors disabled:opacity-50"
                  >
                    {validatePromoMutation.isPending ? "..." : "APPLY"}
                  </button>
                </div>
                {promoError && (
                  <Typography className="text-red-500 font-bold text-sm mt-2 uppercase text-xs">
                    * {promoError}
                  </Typography>
                )}
              </div>
            )}
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

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <Typography className="font-bold uppercase text-sm text-gray-400">
                  Subtotal
                </Typography>
                <Typography className="font-bold text-sm">
                  IDR {total.toLocaleString("id-ID")}
                </Typography>
              </div>

              {appliedPromo && (
                <div className="flex justify-between items-center text-neon-cyan">
                  <Typography className="font-bold uppercase text-sm">
                    Promo ({appliedPromo.code})
                  </Typography>
                  <Typography className="font-bold text-sm">
                    - IDR {appliedPromo.discount.toLocaleString("id-ID")}
                  </Typography>
                </div>
              )}

              <Divider className="border-white/20 border-1 my-2" />

              <div className="flex justify-between items-center">
                <Typography className="font-bold uppercase text-sm text-gray-400">
                  Amount to pay
                </Typography>
                <Typography className="font-display font-black text-2xl text-neon-cyan">
                  IDR {finalTotal.toLocaleString("id-ID")}
                </Typography>
              </div>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={createOrderMutation.isPending || isProcessing}
              className="w-full py-4 bg-neon-purple text-white font-black uppercase tracking-widest shadow-[4px_4px_0_0_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#fff] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrderMutation.isPending || isProcessing ? "Processing..." : "Make Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
