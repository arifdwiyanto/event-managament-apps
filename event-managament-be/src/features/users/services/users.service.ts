import { UserPointRepository } from "../../userPoint/repositories/userPoint.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { deleteCloudinaryImage } from "../../uploadCloudinary/utils/uploadImage.js";

export class UsersService {
  private UsersRepository = new UsersRepository();
  private UserPointRepository = new UserPointRepository();
  constructor() {
    this.UsersRepository = new UsersRepository();
    this.UserPointRepository = new UserPointRepository();
  }
  public create = async (data: any): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public findAll = async (): Promise<any[]> => {
    throw new Error("Method not implemented.");
  };

  public findOne = async (id: string): Promise<any> => {
    const user = await this.UsersRepository.findById(id);
    const userPointBalance = await this.UserPointRepository.getUserBalance(id);

    return {
      id: user?.id,
      name: user?.name,
      referralCode: user?.referralCode,
      userPointBalance: userPointBalance,
      memberSince: user?.createdAt,
    };
  };

  public update = async (id: number, data: any): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public updateAvatar = async (id: string, fileUrl: string | undefined): Promise<any> => {
    if (!fileUrl) {
      throw { status: 400, message: "No image file provided" };
    }
    const user = await this.UsersRepository.findById(id);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Delete old avatar from Cloudinary if it exists
    if (user.avatarUrl) {
      await deleteCloudinaryImage(user.avatarUrl);
    }

    return await this.UsersRepository.updateAvatar(id, fileUrl);
  };

  public delete = async (id: number): Promise<any> => {
    throw new Error("Method not implemented.");
  };

  public getPointsBalance = async (userId: number): Promise<any> => {
    throw new Error("Method not implemented.");
  };
}
