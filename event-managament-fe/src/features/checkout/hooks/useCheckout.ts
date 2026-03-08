import { useMemo, useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { useValidatePromotion } from "@/features/promotions/hooks/usePromotions";
import { AppliedPromo, AppliedCoupon } from "../types/checkout.types";
import { groupCartItemsByOrganizer } from "@/features/cart/utils/groupItems";
import { useUserPoints } from "@/features/userPoint/hooks/useUserPoints";
import { UserCoupon } from "../services/userCouponService";

const LS_KEYS = {
  PROMOS: "checkout_appliedPromos",
  COUPON: "checkout_appliedCoupon",
  POINTS: "checkout_pointPercentage",
} as const;

function loadFromLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently ignore
  }
}

function clearCheckoutLS() {
  Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
}

export const useCheckout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, clearCart } = useCartStore();
  const { user } = useStoreLogin();
  const { data: pointBalance } = useUserPoints();
  const createOrderMutation = useCreateOrder();
  const validatePromoMutation = useValidatePromotion();

  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({});
  // Keyed by eventId — one promo per event (persisted)
  const [appliedPromos, setAppliedPromos] = useState<
    Record<string, AppliedPromo>
  >(() => loadFromLS(LS_KEYS.PROMOS, {}));
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({});
  const [pointPercentage, setPointPercentage] = useState<number>(
    () => loadFromLS(LS_KEYS.POINTS, 0),
  );
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    () => loadFromLS(LS_KEYS.COUPON, null),
  );

  // Sync state → localStorage
  useEffect(() => { saveToLS(LS_KEYS.PROMOS, appliedPromos); }, [appliedPromos]);
  useEffect(() => { saveToLS(LS_KEYS.COUPON, appliedCoupon); }, [appliedCoupon]);
  useEffect(() => { saveToLS(LS_KEYS.POINTS, pointPercentage); }, [pointPercentage]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const groupedItems = useMemo(() => {
    return cart ? groupCartItemsByOrganizer(cart.items) : [];
  }, [cart]);

  // Subtotal per event (for promo discount calculation)
  const subtotalPerEvent = useMemo(() => {
    const result: Record<string, number> = {};
    groupedItems.forEach((group) => {
      group.eventGroups.forEach((eg) => {
        let eventTotal = 0;
        eg.items.forEach((item) => {
          eventTotal += Number(item.ticketType.price) * item.quantity;
        });
        result[eg.eventId] = eventTotal;
      });
    });
    return result;
  }, [groupedItems]);

  const totalOriginal = useMemo(() => {
    return Object.values(subtotalPerEvent).reduce((acc, val) => acc + val, 0);
  }, [subtotalPerEvent]);

  // Apply promo from selector (per event)
  const handleApplyPromoFromSelector = useCallback(
    (eventId: string, promo: AppliedPromo) => {
      setAppliedPromos((prev) => ({ ...prev, [eventId]: promo }));
      setToast({
        open: true,
        message: `Promo "${promo.code}" applied!`,
        severity: "success",
      });
    },
    [],
  );

  const handleApplyPromo = async (eventId: string) => {
    const code = promoCodes[eventId];
    if (!code || !code.trim()) return;

    setPromoErrors((prev) => ({ ...prev, [eventId]: "" }));

    try {
      const result = await validatePromoMutation.mutateAsync({
        code,
        userId: user?.id,
        eventId,
      });

      if (result.valid) {
        const promo = result.promotion;
        const eventSubtotal = subtotalPerEvent[eventId] || 0;
        let discountVal = 0;

        if (promo.discountPercentage) {
          discountVal =
            (eventSubtotal * Number(promo.discountPercentage)) / 100;
        } else if (promo.discountAmount) {
          discountVal = Number(promo.discountAmount);
        }

        setAppliedPromos((prev) => ({
          ...prev,
          [eventId]: {
            id: promo.id,
            code: promo.code,
            discount: discountVal,
            eventId,
            discountPercentage: promo.discountPercentage,
            discountAmount: promo.discountAmount,
          },
        }));
        setPromoCodes((prev) => ({ ...prev, [eventId]: "" }));
        setToast({
          open: true,
          message: "Promo code applied!",
          severity: "success",
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error.message || "Invalid promo code";
      setPromoErrors((prev) => ({ ...prev, [eventId]: msg }));
      setToast({ open: true, message: msg, severity: "error" });
    }
  };

  const handleRemovePromo = (eventId: string) => {
    setAppliedPromos((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  };

  const handleSelectCoupon = useCallback((coupon: UserCoupon | null) => {
    if (!coupon) {
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({
      id: coupon.id,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
    setToast({
      open: true,
      message: `Coupon "${coupon.code}" applied!`,
      severity: "success",
    });
  }, []);

  const totalPromoDiscount = useMemo(() => {
    return Object.values(appliedPromos).reduce(
      (acc, promo) => acc + promo.discount,
      0,
    );
  }, [appliedPromos]);

  const pointDiscount = useMemo(() => {
    if (!pointBalance || pointPercentage === 0) return 0;
    return (pointBalance * pointPercentage) / 100;
  }, [pointBalance, pointPercentage]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const afterPromoAndPoints = Math.max(
      0,
      totalOriginal - totalPromoDiscount - pointDiscount,
    );
    return (afterPromoAndPoints * appliedCoupon.discountPercentage) / 100;
  }, [appliedCoupon, totalOriginal, totalPromoDiscount, pointDiscount]);

  const finalTotal = Math.max(
    0,
    totalOriginal - totalPromoDiscount - pointDiscount - couponDiscount,
  );

  const handleCreateOrder = async () => {
    if (!user || !user.id) {
      setToast({
        open: true,
        message: "Hype Failed! Please login first",
        severity: "error",
      });
      return;
    }

    if (!cart || cart.items.length === 0) {
      setToast({ open: true, message: "Cart is empty", severity: "error" });
      return;
    }

    try {
      const items = cart.items.map((item) => {
        const eventId = item.ticketType.eventId;
        const promo = appliedPromos[eventId];

        return {
          ticketId: item.ticketTypeId,
          qty: item.quantity,
          promotionId: promo ? promo.id : undefined,
        };
      });

      const payload = {
        customerId: user.id,
        paymentMethod: "MIDTRANS",
        pointUsed: pointDiscount,
        voucherId: appliedCoupon?.id,
        items,
      };

      const newOrder = await createOrderMutation.mutateAsync(payload);

      await clearCart();
      clearCheckoutLS();
      queryClient.invalidateQueries({ queryKey: ["userPoints", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["userCoupons"] });

      if (newOrder.snapToken) {
        (window as any).snap.pay(newOrder.snapToken, {
          onSuccess: function (result: any) {
            setToast({
              open: true,
              message: "Payment success!",
              severity: "success",
            });
            router.push(`/user/orders/${newOrder.id}`);
          },
          onPending: function (result: any) {
            setToast({
              open: true,
              message: "Payment pending!",
              severity: "success",
            });
            router.push(`/user/orders/${newOrder.id}`);
          },
          onError: function (result: any) {
            setToast({
              open: true,
              message: "Payment failed!",
              severity: "error",
            });
            router.push(`/user/orders/${newOrder.id}`);
          },
          onClose: function () {
            setToast({
              open: true,
              message: "Payment popup closed",
              severity: "error",
            });
            router.push(`/user/orders/${newOrder.id}`);
          },
        });
      } else {
        setToast({
          open: true,
          message: "Vibe Secured! Order created successfully.",
          severity: "success",
        });
        setTimeout(() => {
          router.push(`/user/orders/${newOrder.id}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Failed to create order", error);
      setToast({
        open: true,
        message: `Hype Failed! ${error.message || "Unknown error"}`,
        severity: "error",
      });
    }
  };

  return {
    cart,
    user,
    promoCodes,
    setPromoCodes,
    appliedPromos,
    promoErrors,
    pointPercentage,
    setPointPercentage,
    appliedCoupon,
    handleSelectCoupon,
    totalOriginal,
    totalPromoDiscount,
    pointDiscount,
    couponDiscount,
    finalTotal,
    handleApplyPromo,
    handleApplyPromoFromSelector,
    handleRemovePromo,
    handleCreateOrder,
    isSubmitting: createOrderMutation.isPending,
    isValidatingPromo: validatePromoMutation.isPending,
    toast,
    handleCloseToast,
    groupedItems,
    pointBalance: pointBalance || 0,
    subtotalPerEvent,
  };
};
