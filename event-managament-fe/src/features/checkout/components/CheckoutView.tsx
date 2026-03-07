"use client";

import { Typography, Snackbar, Alert } from "@mui/material";
import { useCheckout } from "../hooks/useCheckout";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethod } from "./PaymentMethod";
import { PromoCode } from "./PromoCode";
import { CheckoutTotal } from "./CheckoutTotal";
import { EmptyCart } from "./EmptyCart";
import { UserPointSelector } from "./UserPointSelector";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

export const CheckoutView: React.FC = () => {
  const {
    cart,
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
    isSubmitting,
    isValidatingPromo,
    toast,
    handleCloseToast,
    groupedItems,
    pointBalance,
  } = useCheckout();

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  const onSetPromoCode = (organizerId: string, code: string) => {
    setPromoCodes((prev) => ({ ...prev, [organizerId]: code }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Typography
        variant="h3"
        className="font-display font-black uppercase tracking-tighter mb-8 text-black dark:text-white text-4xl md:text-6xl"
      >
        Checkout
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="md:col-span-2 space-y-10">
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
                
                <div className="mt-8 pt-6 border-t-4 border-black dark:border-white border-double">
                  <Typography className="font-display font-black uppercase text-xs mb-4 text-black dark:text-gray-400 tracking-widest">
                    Organizer Promo Code
                  </Typography>
                  <PromoCode 
                    organizerId={group.organizerId}
                    appliedPromo={appliedPromos[group.organizerId] || null}
                    promoCode={promoCodes[group.organizerId] || ""}
                    promoError={promoErrors[group.organizerId] || ""}
                    isValidating={isValidatingPromo}
                    onSetPromoCode={onSetPromoCode}
                    onApply={() => handleApplyPromo(group.organizerId, group.eventGroups[0].eventId)}
                    onRemove={() => handleRemovePromo(group.organizerId)}
                  />
                </div>
              </div>
            ))}
          </div>

          {pointBalance > 0 && (
            <UserPointSelector 
              balance={pointBalance}
              selectedPercentage={pointPercentage}
              onSelectPercentage={setPointPercentage}
            />
          )}

          <div className="pt-4">
            <Typography variant="h5" className="font-display font-black uppercase mb-6 text-black dark:text-white">
              Payment Method
            </Typography>
            <PaymentMethod 
              methods={PAYMENT_METHODS} 
              selectedPayment={selectedPayment} 
              onSelect={setSelectedPayment} 
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <CheckoutTotal 
            total={totalOriginal}
            totalPromoDiscount={totalPromoDiscount}
            pointDiscount={pointDiscount}
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
