import { prisma } from "src/config/prisma.js";

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
        orderBy: { name: "asc" },
      }),
      prisma.category.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };
}
