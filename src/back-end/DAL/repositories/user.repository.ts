import { Prisma, User } from "@prisma/client";
import prisma from "@/back-end/prisma/prisma-client";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<"user"> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(
    email: string,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return this.findUnique({
      where: { email },
      select,
    } as any);
  }

  async createUser(
    data: {
      email: string;
      name: string;
      hashedPassword: string;
    },
    select?: Prisma.UserSelect,
  ): Promise<User> {
    return this.create({
      data,
      select,
    } as any);
  }

  async upsertByEmail(
    data: {
      email: string;
      name: string;
      hashedPassword: string;
    },
    select?: Prisma.UserSelect,
  ): Promise<User> {
    return this.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        hashedPassword: data.hashedPassword,
      },
      create: {
        email: data.email,
        name: data.name,
        hashedPassword: data.hashedPassword,
      },
      select,
    } as any);
  }
}

export const userRepository = new UserRepository();
