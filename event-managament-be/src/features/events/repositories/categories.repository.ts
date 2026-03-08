import { prisma } from "../../../config/prisma.js";

export class CategoriesRepository {
  public findMany = async (
    filters: any,
    skip?: number,
    take?: number,
  ): Promise<any> => {
    const [data, total] = await prisma.$transaction([
      prisma.category.findMany({
        where: filters,
        skip,
        take,
        include: {
          _count: {
            select: { events: true },
          },
        },
        orderBy: {
          events: {
            _count: "desc",
          },
        },
      }),
      prisma.category.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };
}
