import { email } from "zod";
import { prisma } from "../../../config/prisma.js";
import { RegisterRequest } from "../types/auth.types.js";
import { User, Prisma } from "@prisma/client";
import { UpsertUserGoogleRequest } from "../types/auth.types.js";

export class AuthRepository {
  public findByEmail = async (email: string): Promise<any> => {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
  };

  public createUser = async (data: RegisterRequest): Promise<any> => {
    const role = data.role || "CUSTOMER";
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode || "",
        roles: {
          create: {
            role: role as any,
          },
        },
      },
      include: {
        roles: true,
      },
    });
  };

  public findById = async (id: string): Promise<any> => {
    return await prisma.user.findUnique({
      where: { id: id },
      include: {
        roles: true,
      },
    });
  };

  public findUserByReferralCode = async (
    referralCode: string,
  ): Promise<any> => {
    return await prisma.user.findUnique({
      where: { referralCode: referralCode },
    });
  };

  public createReferral = async (
    referrerId: string,
    referredUserId: string,
    tx?: any,
  ): Promise<any> => {
    const prismaClient = tx || prisma;
    return await prismaClient.referral.create({
      data: {
        referrerId: referrerId,
        referredUserId: referredUserId,
      },
    });
  };

  // Inside AuthRepository class
  public upsertUserGoogle = async (
    data: UpsertUserGoogleRequest,
  ): Promise<User & { roles: { role: string }[] }> => {
    return await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        avatarUrl: data.avatarUrl,
      },
      create: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        password: Math.random().toString(36).slice(-10),
        referralCode: `G-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        roles: {
          create: {
            role: "CUSTOMER",
          },
        },
      },
      include: {
        roles: true,
      },
    });
  };
}
