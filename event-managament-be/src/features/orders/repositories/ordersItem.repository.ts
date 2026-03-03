import { prisma } from "../../../config/prisma.js";

export class OrdersItemRepository {
  public findById = async (id: string): Promise<any> => {
    return await prisma.transactionItem.findUnique({
      where: { id },
      include: {
        ticketType: {
            include: {
                event: true
            }
        },
        transaction: true,
      },
    });
  };
}
