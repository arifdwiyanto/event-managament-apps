import { AuthRepository } from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types.js";
import jwt from "jsonwebtoken";
import { UserPointRepository } from "../../userPoint/repositories/userPoint.repository.js";
import { prisma } from "../../../config/prisma.js";
import { UserCouponRepository } from "../../userCoupons/repositories/voucher.repository.js";
import { NotificationService } from "../../notifications/services/notification.service.js";

export class AuthService {
  private UserPointRepository = new UserPointRepository();
  private AuthRepository = new AuthRepository();
  private UserCouponRepository = new UserCouponRepository();
  private NotificationService = new NotificationService();
  constructor() {
    this.AuthRepository = new AuthRepository();
    this.UserPointRepository = new UserPointRepository();
    this.UserCouponRepository = new UserCouponRepository();
    this.NotificationService = new NotificationService();
  }
  public register = async (data: RegisterRequest): Promise<any> => {
    // Registration logic
    const checkExistingUser = await this.AuthRepository.findByEmail(data.email);
    if (checkExistingUser) {
      throw new Error("email has been already taken");
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const friendReferralCode = data.referralCode;

    let referrerId: string | undefined;

    if (friendReferralCode) {
      const referrer =
        await this.AuthRepository.findUserByReferralCode(friendReferralCode);
      if (!referrer) {
        throw new Error("kode referral tidak valid!");
      }
      referrerId = referrer.id;
    }

    return await prisma.$transaction(async (tx: any) => {
      const newUser = await this.AuthRepository.createUser({
        ...data,
        password: hashPassword,
        referralCode: `REF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      });

      if (referrerId) {
        // Create Referral Record
        await this.AuthRepository.createReferral(referrerId, newUser.id, tx);

        // Give Points to Referrer (10,000 pts, 3 months exp)
        const pointExpiresAt = new Date();
        pointExpiresAt.setMonth(pointExpiresAt.getMonth() + 3);
        
        await this.UserPointRepository.addPoint(
            referrerId,
            10000,
            pointExpiresAt,
            tx
        );

        // Give Coupon to Referee (10% discount, 3 months exp)
        const couponExpiresAt = new Date();
        couponExpiresAt.setMonth(couponExpiresAt.getMonth() + 3);
        const couponCode = `REF-${newUser.id.substring(0, 5)}-${Math.random().toString(36).substring(2, 5)}`.toUpperCase();
        
        await this.UserCouponRepository.createUserCoupon(
            {
                userId: newUser.id,
                code: couponCode,
                discountPercentage: 10,
                expiresAt: couponExpiresAt,
                isUsed: false
            },
                tx
        );

        // Notify Referrer
        await this.NotificationService.sendToUser(
          referrerId,
          {
            title: "Bonus Referral! 🎁",
            message: "Selamat! Kamu baru saja mendapatkan 10.000 poin karena temanmu menggunakan kode referralmu.",
            type: "EARN_REFERRAL",
          },
          tx
        );

        // Notify Referee
        await this.NotificationService.sendToUser(
          newUser.id,
          {
            title: "Selamat Datang! ✨",
            message: "Kamu baru saja mendapatkan kupon diskon 10% karena menggunakan kode referral. Selamat berbelanja!",
            type: "REWARD",
          },
          tx
        );
      }

      // If registering as ORGANIZER, create the Organizer profile + set as OWNER
      if (data.role === "ORGANIZER" && data.organizerName) {
        const organizer = await tx.organizer.create({
          data: {
            ownerId: newUser.id,
            name: data.organizerName.trim(),
            description: data.organizerDescription?.trim() || null,
          },
        });

        await tx.organizerTeam.create({
          data: {
            organizerId: organizer.id,
            userId: newUser.id,
            role: "OWNER",
          },
        });
      }

      return newUser;
    });
  };

  public login = async (data: LoginRequest): Promise<any> => {
    const user = await this.AuthRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("invalid email or password");
    }

    const roles = user.roles.map((r: any) => r.role);
    const token = await this.generateTokens({ ...user, roles });

    // Fetch organizer profile if user has ORGANIZER role
    let organizer = null;
    if (roles.includes("ORGANIZER")) {
      organizer = await prisma.organizer.findFirst({
        where: { 
          teams: {
            some: {
              userId: user.id
            }
          }
        },
        select: { 
          id: true, 
          name: true, 
          description: true, 
          logoUrl: true,
          createdAt:true,
          isVerified:true,
          owner:true,
          teams: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          } 
        },
      });
    }

    return {
      user: {
        id: user.id,
        avatarUrl:user.avatarUrl,
        name: user.name,
        email: user.email,
        roles,
        organizer,
      },
      ...token,
    };
  };

  public getMe = async (id: string): Promise<any> => {
    const user = await this.AuthRepository.findById(id);
    if (!user) {
      throw new Error("user not found");
    }

    const roles = user.roles.map((r: any) => r.role);

    // Fetch organizer profile if user has ORGANIZER role
    let organizer = null;
    if (roles.includes("ORGANIZER")) {
      organizer = await prisma.organizer.findFirst({
        where: { 
          teams: {
            some: {
              userId: id
            }
          }
        },
        select: { 
          id: true, 
          name: true, 
          description: true, 
          logoUrl: true,
          isVerified: true,
          createdAt: true,
          owner: true,
          teams: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
      });
    }

    return {
      id: user.id,
      avatarUrl:user.avatarUrl,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      roles,
      organizer,
    };
  };
  public generateTokens = async (user: any): Promise<any> => {
    const roles = user.roles || [];
    const payload = { id: user.id, roles };
    const secret = process.env.JWT_SECRET || "rahasia bro";

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    return {
      accessToken,
      refreshToken,
    };
  };
}
