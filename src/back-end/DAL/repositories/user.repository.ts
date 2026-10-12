import "server-only";
import type { Prisma, User } from "@prisma/client";
import { BaseRepository } from "@/back-end/DAL/repositories/base.repository";
import prisma from "@/back-end/prisma/prisma-client";

export class UserRepository extends BaseRepository<"user"> {
  public constructor() {
    super(prisma.user);
  }

  public async findByEmail(
    email: string,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return this.findUnique({
      where: { email },
      select,
    });
  }

  public async createUser(
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
    });
  }

  public async upsertByEmail(
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
    });
  }
}

export const userRepository = new UserRepository();
