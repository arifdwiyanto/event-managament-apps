"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { useValidatePromotion } from "@/features/promotions/hooks/usePromotions";
import { AppliedPromo } from "../types/checkout.types";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

export const useCheckout = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user } = useStoreLogin();
  const createOrderMutation = useCreateOrder();
  const validatePromoMutation = useValidatePromotion();

  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
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
      const payload = {
        customerId: user.id,
        paymentMethod: selectedPayment,
        promotionId: appliedPromo ? appliedPromo.id : undefined,
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

  return {
    cart,
    user,
    selectedPayment,
    setSelectedPayment,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoError,
    total,
    finalTotal,
    handleApplyPromo,
    handleRemovePromo,
    handleCreateOrder,
    isSubmitting: createOrderMutation.isPending,
    isValidatingPromo: validatePromoMutation.isPending,
    router,
  };
};
