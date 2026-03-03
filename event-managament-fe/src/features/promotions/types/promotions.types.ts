export interface PromotionEvent {
    eventId: string;
    promotionId: string;
    event?: any;
}

export interface Promotion {
    id: string;
    organizerId: string;
    name: string;
    code: string;
    discountAmount?: number | null;
    discountPercentage?: number | null;
    maxUsage?: number | null;
    startDate: Date | string;
    endDate: Date | string;
    createdAt: Date | string;
    events?: PromotionEvent[];
    _count?: { transactions: number };
}

export interface CreatePromotion {
    organizerId: string;
    name: string;
    code: string;
    discountAmount?: number | null;
    discountPercentage?: number | null;
    maxUsage?: number | null;
    startDate: Date | string;
    endDate: Date | string;
    eventId: string;
    events: {
        create: { eventId: string }[];
    };
}

export interface UpdatePromotion {
    name?: string;
    code?: string;
    discountAmount?: number | null;
    discountPercentage?: number | null;
    maxUsage?: number | null;
    startDate?: Date | string;
    endDate?: Date | string;
}

export interface PaginatedPromotions {
    data: Promotion[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}