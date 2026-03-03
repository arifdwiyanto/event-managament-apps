import { User } from "@prisma/client";
import { prisma } from "src/config/prisma.js";

export class UsersRepository {
  public create = async (data: any): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public findMany = async (): Promise<any[]> => {
    throw new Error("Method not implemented.");
  };

  public findById = async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id: id },
    });
  };

  public update = async (id: number, data: any): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public updateAvatar = async (id: string, avatarUrl: string): Promise<User> => {
    return await prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });
  };

  public delete = async (id: number): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public getPoints = async (userId: number): Promise<any> => {
    throw new Error("Method not implemented.");
  };
}
