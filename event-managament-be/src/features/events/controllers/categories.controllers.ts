import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "../services/categories.service.js";

export class CategoriesController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  public findAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { page: _p, limit: _l, ...filters } = req.query;

      const { data, meta } = await this.categoriesService.findAll(
        filters,
        page,
        limit,
      );

      res.status(200).send({ data, meta });
    } catch (error) {
      next(error);
    }
  };
}

// import { Request, Response, NextFunction } from "express";
// import { prisma } from "src/config/prisma.js";

// export class CategoriesController {
//   public findAll = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     try {
//       const categories = await prisma.category.findMany({
//         orderBy: { name: "asc" },
//       });
//       res.status(200).send({ data: categories });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
