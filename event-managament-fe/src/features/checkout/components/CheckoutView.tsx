"use client";

import { Typography, Snackbar, Alert } from "@mui/material";
import { useCheckout } from "../hooks/useCheckout";
import { OrderSummary } from "./OrderSummary";
import { CheckoutTotal } from "./CheckoutTotal";
import { EmptyCart } from "./EmptyCart";
import { UserPointSelector } from "./UserPointSelector";
import { UserCouponSelector } from "./UserCouponSelector";
import { EventPromoSelector } from "./EventPromoSelector";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

export const CheckoutView: React.FC = () => {
  const {
    cart,
    appliedPromos,
    pointPercentage,
    setPointPercentage,
    appliedCoupon,
    handleSelectCoupon,
    totalOriginal,
    totalPromoDiscount,
    pointDiscount,
    couponDiscount,
    finalTotal,
    handleApplyPromoFromSelector,
    handleRemovePromo,
    handleCreateOrder,
    isSubmitting,
    toast,
    handleCloseToast,
    groupedItems,
    pointBalance,
    subtotalPerGroup,
  } = useCheckout();

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Typography
        variant="h3"
        className="font-display font-black uppercase tracking-tighter mb-8 text-black dark:text-white text-4xl md:text-6xl"
      >
        Checkout
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="md:col-span-2 space-y-6">

          {/* Grouped items with per-event promo selectors */}
          <div className="space-y-8">
            {groupedItems.map((group) => (
              <div
                key={group.organizerId}
                className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-[#0a0a0a]"
              >
                <OrderSummary
                  group={group}
                  appliedPromo={appliedPromos[group.organizerId] || null}
                />

                {/* Per-event promo selectors */}
                {group.eventGroups.map((eg) => (
                  <EventPromoSelector
                    key={eg.eventId}
                    eventId={eg.eventId}
                    eventName={eg.eventName}
                    organizerId={group.organizerId}
                    appliedPromo={appliedPromos[group.organizerId] || null}
                    eventSubtotal={subtotalPerGroup[group.organizerId] || 0}
                    onApply={handleApplyPromoFromSelector}
                    onRemove={handleRemovePromo}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* User Referral Coupon Selector */}
          <UserCouponSelector
            selectedCouponId={appliedCoupon?.id || null}
            onSelect={handleSelectCoupon}
          />

          {/* User Points */}
          {pointBalance > 0 && (
            <UserPointSelector
              balance={pointBalance}
              selectedPercentage={pointPercentage}
              onSelectPercentage={setPointPercentage}
            />
          )}
        </div>

        <div className="md:col-span-1">
          <CheckoutTotal
            total={totalOriginal}
            totalPromoDiscount={totalPromoDiscount}
            pointDiscount={pointDiscount}
            couponDiscount={couponDiscount}
            finalTotal={finalTotal}
            onPay={handleCreateOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          className="font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#000]"
          sx={{ borderRadius: 0 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
