import { CategoriesRepository } from "../repositories/categories.repository.js";

export class CategoriesService {
  private categoriesRepository: CategoriesRepository;

  constructor() {
    this.categoriesRepository = new CategoriesRepository();
  }

  public findAll = async (
    filters: any,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.categoriesRepository.findMany(
      filters,
      skip,
      take,
    );

    return {
      data: data.map((category: any) => ({
        ...category,
        eventCount: category._count?.events || 0,
        _count: undefined,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
}
