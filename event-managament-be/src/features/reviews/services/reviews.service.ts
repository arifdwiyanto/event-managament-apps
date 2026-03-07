import { OrdersItemRepository } from "../../orders/repositories/ordersItem.repository.js";
import { ReviewsRepository } from "../repositories/reviews.repository.js";

export class ReviewsService {
  private reviewsRepository: ReviewsRepository;
  private ordersItemRepository: OrdersItemRepository;

  constructor() {
    this.reviewsRepository = new ReviewsRepository();
    this.ordersItemRepository = new OrdersItemRepository();
  }

  public create = async (
    data: {
      rating: number;
      feedback?: string;
      transactionItemId: string;
    },
    userId: string,
  ): Promise<any> => {
    const item = await this.ordersItemRepository.findById(
      data.transactionItemId,
    );

    if (!item) {
      throw new Error("Transaction item not found");
    }

    const event = item.ticketType?.event;
    const eventId = event?.id;
    const itemUserId = item.transaction?.userId;

    if (!eventId || !itemUserId) {
      throw new Error("Invalid transaction item data for review");
    }

    if (itemUserId !== userId) {
      throw new Error("Unauthorized to review this item");
    }

    if (item.transaction?.status !== "PAID") {
      throw new Error("Can only review paid orders");
    }

    if (event.endDate && new Date() < new Date(event.endDate)) {
      throw new Error("Cannot review an event that has not yet ended");
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const existingReview = await this.reviewsRepository.findByUserAndEvent(
      userId,
      eventId,
    );
    if (existingReview) {
      throw new Error("You have already reviewed this event");
    }

    return await this.reviewsRepository.create({
      rating: data.rating,
      comment: data.feedback,
      userId: userId,
      eventId: eventId,
    });
  };

  public findAll = async (
    filters: any,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.reviewsRepository.findMany(
      filters,
      skip,
      take,
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  public findOne = async (id: string): Promise<any> => {
    const review = await this.reviewsRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  };

  public update = async (id: string, data: any): Promise<any> => {
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    return await this.reviewsRepository.update(id, data);
  };

  public delete = async (id: string): Promise<any> => {
    return await this.reviewsRepository.delete(id);
  };

  public findByEvent = async (
    eventId: string,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.reviewsRepository.findManyByEvent(
      eventId,
      skip,
      take,
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
}
