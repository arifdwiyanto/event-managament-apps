import { useMemo, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { useValidatePromotion } from "@/features/promotions/hooks/usePromotions";
import { AppliedPromo } from "../types/checkout.types";
import { PAYMENT_METHODS } from "../constants/paymentMethods";
import { groupCartItemsByOrganizer } from "@/features/cart/utils/groupItems";
import { useUserPoints } from "@/features/userPoint/hooks/useUserPoints";

export const useCheckout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, clearCart } = useCartStore();
  const { user } = useStoreLogin();
  const { data: pointBalance } = useUserPoints();
  const createOrderMutation = useCreateOrder();
  const validatePromoMutation = useValidatePromotion();

  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({});
  const [appliedPromos, setAppliedPromos] = useState<Record<string, AppliedPromo>>({});
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({});
  const [pointPercentage, setPointPercentage] = useState<number>(0);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const groupedItems = useMemo(() => {
    return cart ? groupCartItemsByOrganizer(cart.items) : [];
  }, [cart]);

  const subtotalPerGroup = useMemo(() => {
    const result: Record<string, number> = {};
    groupedItems.forEach((group) => {
      let groupTotal = 0;
      group.eventGroups.forEach((eg) => {
        eg.items.forEach((item) => {
          groupTotal += Number(item.ticketType.price) * item.quantity;
        });
      });
      result[group.organizerId] = groupTotal;
    });
    return result;
  }, [groupedItems]);

  const totalOriginal = useMemo(() => {
    return Object.values(subtotalPerGroup).reduce((acc, val) => acc + val, 0);
  }, [subtotalPerGroup]);

  const handleApplyPromo = async (organizerId: string, eventId: string) => {
    const code = promoCodes[organizerId];
    if (!code || !code.trim()) return;

    setPromoErrors((prev) => ({ ...prev, [organizerId]: "" }));

    try {
      const result = await validatePromoMutation.mutateAsync({
        code,
        userId: user?.id,
        eventId,
      });

      if (result.valid) {
        const promo = result.promotion;
        const groupSubtotal = subtotalPerGroup[organizerId] || 0;
        let discountVal = 0;
        
        if (promo.discountPercentage) {
          discountVal = (groupSubtotal * Number(promo.discountPercentage)) / 100;
        } else if (promo.discountAmount) {
          discountVal = Number(promo.discountAmount);
        }

        setAppliedPromos((prev) => ({
          ...prev,
          [organizerId]: {
            id: promo.id,
            code: promo.code,
            discount: discountVal,
            eventId,
            discountPercentage: promo.discountPercentage,
            discountAmount: promo.discountAmount,
          },
        }));
        setPromoCodes((prev) => ({ ...prev, [organizerId]: "" }));
        setToast({ open: true, message: "Promo code applied!", severity: "success" });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Invalid promo code";
      setPromoErrors((prev) => ({ ...prev, [organizerId]: msg }));
      setToast({ open: true, message: msg, severity: "error" });
    }
  };

  const handleRemovePromo = (organizerId: string) => {
    setAppliedPromos((prev) => {
      const next = { ...prev };
      delete next[organizerId];
      return next;
    });
  };

  const totalPromoDiscount = useMemo(() => {
    return Object.values(appliedPromos).reduce((acc, promo) => acc + promo.discount, 0);
  }, [appliedPromos]);

  const pointDiscount = useMemo(() => {
    if (!pointBalance || pointPercentage === 0) return 0;
    return (pointBalance * pointPercentage) / 100;
  }, [pointBalance, pointPercentage]);

  const finalTotal = Math.max(0, totalOriginal - totalPromoDiscount - pointDiscount);

  const handleCreateOrder = async () => {
    if (!user || !user.id) {
      setToast({ open: true, message: "Hype Failed! Please login first", severity: "error" });
      return;
    }

    if (!cart || cart.items.length === 0) {
      setToast({ open: true, message: "Cart is empty", severity: "error" });
      return;
    }

    try {
      // Collect items with their specific promos
      const items = cart.items.map((item) => {
        // Find if this item belongs to an organizer group with an applied promo
        // A better way would be to group by eventId, but organizers often manage entire events.
        // For now, mapping promo by organizerId works if one promo is applied per organizer block.
        const organizerId = item.ticketType.event?.organizerId || "";
        const promo = appliedPromos[organizerId];
        
        return {
          ticketId: item.ticketTypeId,
          qty: item.quantity,
          promotionId: promo?.eventId === item.ticketType.eventId ? promo.id : undefined,
        };
      });

      const payload = {
        customerId: user.id,
        paymentMethod: selectedPayment,
        pointUsed: pointDiscount,
        items,
      };

      const newOrder = await createOrderMutation.mutateAsync(payload);

      await clearCart();
      queryClient.invalidateQueries({ queryKey: ["userPoints", "balance"] });
      setToast({ open: true, message: "Vibe Secured! Order created successfully.", severity: "success" });
      
      setTimeout(() => {
        router.push(`/user/orders/${newOrder.id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create order", error);
      setToast({ open: true, message: `Hype Failed! ${error.message || "Unknown error"}`, severity: "error" });
    }
  };

  return {
    cart,
    user,
    selectedPayment,
    setSelectedPayment,
    promoCodes,
    setPromoCodes,
    appliedPromos,
    promoErrors,
    pointPercentage,
    setPointPercentage,
    totalOriginal,
    totalPromoDiscount,
    pointDiscount,
    finalTotal,
    handleApplyPromo,
    handleRemovePromo,
    handleCreateOrder,
    isSubmitting: createOrderMutation.isPending,
    isValidatingPromo: validatePromoMutation.isPending,
    toast,
    handleCloseToast,
    groupedItems,
    pointBalance: pointBalance || 0,
  };
};
