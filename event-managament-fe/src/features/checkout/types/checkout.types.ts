export interface PaymentMethod {
  id: string;
  label: string;
}

export interface AppliedPromo {
  id: string;
  code: string;
  discount: number;
  eventId: string;
  discountPercentage?: number | null;
  discountAmount?: number | null;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountPercentage: number;
}

export interface CheckoutState {
  selectedPayment: string;
  promoCodes: Record<string, string>; // eventId -> code input
  appliedPromos: Record<string, AppliedPromo>; // eventId -> applied promo
  promoErrors: Record<string, string>; // eventId -> error
  pointPercentage: number; // 0, 10, 25, 50, 75, 100
  appliedCoupon: AppliedCoupon | null;
}
