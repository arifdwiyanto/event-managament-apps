"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useCheckout } from "../hooks/useCheckout";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethod } from "./PaymentMethod";
import { PromoCode } from "./PromoCode";
import { CheckoutTotal } from "./CheckoutTotal";
import { EmptyCart } from "./EmptyCart";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

export const CheckoutView: React.FC = () => {
  const {
    cart,
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
    isSubmitting,
    isValidatingPromo,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <OrderSummary items={cart.items} />
          
          <PaymentMethod 
            methods={PAYMENT_METHODS} 
            selectedPayment={selectedPayment} 
            onSelect={setSelectedPayment} 
          />

          <PromoCode 
            appliedPromo={appliedPromo}
            promoCode={promoCode}
            promoError={promoError}
            isValidating={isValidatingPromo}
            onSetPromoCode={setPromoCode}
            onApply={handleApplyPromo}
            onRemove={handleRemovePromo}
          />
        </div>

        <div className="md:col-span-1">
          <CheckoutTotal 
            total={total}
            appliedPromoCode={appliedPromo?.code}
            appliedPromoDiscount={appliedPromo?.discount}
            finalTotal={finalTotal}
            onPay={handleCreateOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
