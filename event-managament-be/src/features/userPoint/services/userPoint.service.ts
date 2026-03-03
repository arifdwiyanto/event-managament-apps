import { UserPointRepository } from "../repositories/userPoint.repository.js";

export class UserPointService {
  private userPointRepository: UserPointRepository;

  constructor() {
    this.userPointRepository = new UserPointRepository();
  }

  public getUserBalance = async (userId: string): Promise<number> => {
    return await this.userPointRepository.getUserBalance(userId);
  };

  public addPoint = async (
    userId: string,
    amount: number,
    expiredDate: Date
  ): Promise<any> => {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    return await this.userPointRepository.addPoint(userId, amount, expiredDate);
  };

  public usePoints = async (
    userId: string,
    amountToUse: number
  ): Promise<void> => {
    if (amountToUse <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const balance = await this.userPointRepository.getUserBalance(userId);
    if (balance < amountToUse) {
      throw new Error("Insufficient point balance");
    }

    return await this.userPointRepository.usePoints(userId, amountToUse);
  };
}
