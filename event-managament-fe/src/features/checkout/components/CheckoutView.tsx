"use client";

import { Typography, Snackbar, Alert } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useCheckout } from "../hooks/useCheckout";
import { OrderSummary } from "./OrderSummary";
import { CheckoutTotal } from "./CheckoutTotal";
import { EmptyCart } from "./EmptyCart";
import { UserPointSelector } from "./UserPointSelector";
import { UserCouponSelector } from "./UserCouponSelector";
import { EventPromoSelector } from "./EventPromoSelector";

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
    subtotalPerEvent,
  } = useCheckout();

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-neon-purple/10 dark:bg-neon-purple/20 border-2 border-neon-purple">
            <ShoppingBagOutlinedIcon className="text-neon-purple" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <Typography className="font-display font-black uppercase tracking-tight text-black dark:text-white text-3xl md:text-5xl leading-none">
              Checkout
            </Typography>
            <Typography className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
              {cart.items.length} item{cart.items.length > 1 ? "s" : ""} in your cart
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-20">
          {/* Left Column — Cart Items + Discounts */}
          <div className="lg:col-span-8 space-y-6">

            {/* Order Groups */}
            <div className="space-y-6">
              {groupedItems.map((group) => (
                <div
                  key={group.organizerId}
                  className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#111111] p-6 md:p-8 shadow-sm dark:shadow-none transition-all hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                >
                  <OrderSummary
                    group={group}
                    appliedPromos={appliedPromos}
                    renderPromoSelector={(eg) => (
                      <EventPromoSelector
                        key={eg.eventId}
                        eventId={eg.eventId}
                        eventName={eg.eventName}
                        appliedPromo={appliedPromos[eg.eventId] || null}
                        eventSubtotal={subtotalPerEvent[eg.eventId] || 0}
                        onApply={handleApplyPromoFromSelector}
                        onRemove={handleRemovePromo}
                      />
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Discounts Section */}
            <div className="space-y-4">
              <p className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 px-1">
                Additional Discounts
              </p>

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
          </div>

          {/* Right Column — Total */}
          <div className="lg:col-span-4">
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
            className="font-bold uppercase tracking-wider"
            sx={{
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};
