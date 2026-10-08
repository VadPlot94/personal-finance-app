import "server-only";
import type { Pot, Prisma } from "@prisma/client";
import { BaseRepository } from "@/back-end/DAL/repositories/base.repository";
import prisma from "@/back-end/prisma/prisma-client";

export class PotRepository extends BaseRepository<"pot"> {
  constructor() {
    super(prisma.pot);
  }

  public async create<T extends Prisma.PotCreateArgs = Prisma.PotCreateArgs>(
    args: T,
  ): Promise<Prisma.PotGetPayload<T>> {
    return this.model.create(args) as Promise<Prisma.PotGetPayload<T>>;
  }

  public async createNewPot() {}

  /**
   * Get all pots (sorted by name)
   */
  async getAll(userId: string): Promise<Pot[]> {
    return this.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get pot by id
   */
  public async getById(id: string, userId: string): Promise<Pot | null> {
    return this.findFirst({
      where: { id, userId },
    });
  }

  /**
   * Get pot by name
   */
  async getByName(name: string, userId: string): Promise<Pot | null> {
    return this.findFirst({
      where: { name, userId },
    });
  }

  /**
   * Checks if a name can be used for a pot.
   * - When creating (no id provided): the name must not exist at all.
   * - When editing (id provided): the name must not be used by any other pot (excluding the current one).
   */
  // public async isNameUnique(
  //   name: string | undefined,
  //   excludeId?: string,
  // ): Promise<boolean> {
  //   const pot = await this.findFirst({
  //     where: {
  //       name,
  //       // If id is provided — exclude the current pot from the check
  //       id: excludeId ? { not: excludeId } : undefined,
  //     },
  //     select: { id: true }, // minimal data
  //   });

  //   return !pot; // true = name is available, false = name is taken
  // }

  /**
   * Create a new pot
   */
  async createPot(
    data: {
      name: string;
      target: number;
      total?: number;
      theme: string;
      userId: string;
    },
    select?: Prisma.PotSelect,
  ): Promise<Pot> {
    return this.create({
      data: {
        name: data.name,
        target: data.target,
        total: data.total ?? 0,
        theme: data.theme,
        userId: data.userId,
      },
      select,
    });
  }

  /**
   * Update the current amount in a pot (add/withdraw)
   */
  async addToPot(id: string, amount: number, userId: string): Promise<Pot> {
    return this.updateOwned({
      where: { id, userId },
      data: {
        total: {
          increment: amount,
        },
      },
    });
  }

  /**
   * Get progress for all pots (how much remains until the target)
   */
  async getProgress(userId: string): Promise<
    Array<{
      name: string;
      target: number;
      total: number;
      progress: number;
    }>
  > {
    const pots = await this.findMany({ where: { userId } });
    return pots.map((pot) => ({
      name: pot.name,
      target: pot.target,
      total: pot.total,
      progress: pot.target > 0 ? (pot.total / pot.target) * 100 : 0,
    }));
  }
}

export const potRepository = new PotRepository();
