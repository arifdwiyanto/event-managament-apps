export interface PaymentMethod {
  id: string;
  label: string;
}

export interface AppliedPromo {
  id: string;
  code: string;
  discount: number;
}

export interface CheckoutState {
  selectedPayment: string;
  promoCode: string;
  appliedPromo: AppliedPromo | null;
  promoError: string;
}
