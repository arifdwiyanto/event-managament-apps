import { prisma } from "../../../config/prisma.js";
import { PromotionsRepository } from "../repositories/promotions.repository.js";
import { Prisma } from "@prisma/client";
import { EventsRepository } from "../../events/repositories/events.repository.js";
import { OrdersRepository } from "../../orders/repositories/orders.repository.js";

export class PromotionsService {
  private promotionsRepository: PromotionsRepository;
  private eventsRepository: EventsRepository;

  constructor() {
    this.promotionsRepository = new PromotionsRepository();
    this.eventsRepository = new EventsRepository();
  }

  public create = async (data: any): Promise<any> => {
    return await prisma.$transaction(async (tx) => {
      const eventId =
        data.eventId || data.ticketId || data.events?.create[0]?.eventId;
      const event = await this.eventsRepository.findById(eventId);

      if (!event) {
        throw new Error(`Event with id ${eventId} not found`);
      }

      return await this.promotionsRepository.create(data, tx);
    });
  };

  public findAll = async (
    filters: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.promotionsRepository.findMany(
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
    const promotion = await this.promotionsRepository.findById(id);

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    return promotion;
  };

  public update = async (id: string, data: any): Promise<any> => {
    return this.promotionsRepository.update(id, data);
  };

  public delete = async (id: string): Promise<any> => {
    return this.promotionsRepository.delete(id);
  };

  public getEventPromotions = async (eventId: string): Promise<any[]> => {
    const promos = await this.promotionsRepository.findByEventId(eventId);
    return promos.map((p: any) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      discountAmount: p.discountAmount ? Number(p.discountAmount) : null,
      discountPercentage: p.discountPercentage ? Number(p.discountPercentage) : null,
      startDate: p.startDate,
      endDate: p.endDate,
      maxUsage: p.maxUsage,
      usageCount: p._count?.transactions ?? 0,
      remaining: p.maxUsage !== null ? (p.maxUsage - (p._count?.transactions ?? 0)) : null,
    }));
  };

  public validate = async (
    code: string,
    userId?: string,
    eventId?: string,
  ): Promise<any> => {
    const promotion = await this.promotionsRepository.findByCode(code);

    if (!promotion) {
      throw new Error("Promotion not founf");
    }

    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (now < start || now > end) {
      throw new Error("Promotion is not active");
    }

    if (eventId) {
      const applies = (promotion.events || []).some((pe: any) => {
        return (
          (pe.eventId && pe.eventId === eventId) ||
          (pe.event && pe.event.id === eventId)
        );
      });

      if (!applies) {
        throw new Error("Promotion does not apply to this event");
      }
    }

    if (
      promotion.maxUsage !== null &&
      promotion.maxUsage !== undefined &&
      promotion._count &&
      promotion._count.transactions >= promotion.maxUsage
    ) {
      throw new Error("Promotion usage limit exceeded");
    }

    if (userId) {
      const existing = await prisma.transaction.findFirst({
        where: {
          userId,
          promotionId: promotion.id,
        },
      });

      if (existing) {
        throw new Error("User has already used this promotion");
      }
    }

    return {
      valid: true,
      promotion,
    };
  };
}
