export interface OrderItem {
  id: string;
  transactionId: string;
  ticketTypeId: string;
  quantity: number;
  pricePerUnit: string | number;
  totalPrice: string | number;
  ticketType: {
    id: string;
    name: string;
    price: string | number;
    description: string | null;
  };
}

export interface Order {
  id: string;
  invoice: string;
  userId: string;
  eventId: string;
  totalOriginalPrice: string | number;
  totalFinalPrice: string | number;
  pointsUsed: number;
  userCouponId: string | null;
  promotionId: string | null;
  status: "PENDING" | "PAID" | "CANCELED" | "REFUNDED";
  paymentMethod: string;
  paymentProofUrl?: string;
  snapToken?: string;
  transactionDate: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
  event?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  promotion?: {
    id: string;
    code: string;
  };
}

export interface CreateOrderPayload {
  customerId: string;
  pointUsed?: number;
  voucherId?: string;
  paymentMethod: string;
  items: {
    ticketId: string;
    qty: number;
  }[];
}

export interface PayOrderPayload {
  method?: string;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
