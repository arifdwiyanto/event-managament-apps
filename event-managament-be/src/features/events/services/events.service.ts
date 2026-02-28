import { EventsRepository } from "../repositories/events.repository.js";

export class EventsService {
  private eventsRepository: EventsRepository;

  constructor() {
    this.eventsRepository = new EventsRepository();
  }

  public create = async (data: any): Promise<any> => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      throw new Error("End date must be after start date");
    }

    const { ticketTypes, ...restData } = data;
    const createData: any = { ...restData };

    if (ticketTypes && Array.isArray(ticketTypes)) {
      createData.ticketTypes = {
        create: ticketTypes,
      };
    }

    return this.eventsRepository.create(createData);
  };

  public findAll = async (
    filters: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (filters.organizerId) {
      where.organizerId = filters.organizerId;
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }
    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    const { data, total } = await this.eventsRepository.findMany(
      where,
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

  public findOne = async (id: any): Promise<any> => {
    const event = await this.eventsRepository.findById(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  };

  public update = async (id: any, data: any): Promise<any> => {
    if (data.startDate && data.endDate) {
      if (
        new Date(data.endDate as string) <= new Date(data.startDate as string)
      ) {
        throw new Error("End date must be after start date");
      }
    }

    return this.eventsRepository.update(id, data);
  };

  public delete = async (id: any): Promise<any> => {
    return this.eventsRepository.delete(id);
  };
}
