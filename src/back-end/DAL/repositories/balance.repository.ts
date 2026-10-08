import "server-only";
import type { Balance } from "@prisma/client";
import { BaseRepository } from "@/back-end/DAL/repositories/base.repository";
import prisma from "@/back-end/prisma/prisma-client";

export class BalanceRepository extends BaseRepository<"balance"> {
  constructor() {
    super(prisma.balance);
  }

  /**
   * Get the current balance (most recent by updatedAt)
   */
  public async getCurrent(userId: string): Promise<Balance | null> {
    return this.findFirst({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get balance by ID (when using a fixed ID, e.g. 'initial-balance')
   */
  async getById(id: string, userId: string): Promise<Balance | null> {
    return this.findFirst({
      where: { id, userId },
    });
  }

  /**
   * Update the current balance (if the record already exists)
   */
  async updateBalance(
    id: string,
    data: {
      current?: number;
      income?: number;
      expenses?: number;
    },
    userId: string,
  ): Promise<Balance> {
    return this.update({
      where: { id, userId },
      data,
    });
  }

  /**
   * Create or update balance (upsert)
   */
  async upsertBalance(data: {
    userId: string;
    id?: string;
    current: number;
    income: number;
    expenses: number;
  }): Promise<Balance> {
    return this.upsert({
      where: { userId: data.userId },
      update: {
        current: data.current,
        income: data.income,
        expenses: data.expenses,
      },
      create: {
        id: data.id,
        userId: data.userId,
        current: data.current,
        income: data.income,
        expenses: data.expenses,
      },
    });
  }

  /**
   * Get total income / expenses / balance (aggregation)
   */
  async getSummary(userId: string): Promise<{
    current: number | null;
    totalIncome: number | null;
    totalExpenses: number | null;
  }> {
    const result = await prisma.balance.aggregate({
      where: { userId },
      _sum: {
        current: true,
        income: true,
        expenses: true,
      },
    });

    return {
      current: result._sum.current,
      totalIncome: result._sum.income,
      totalExpenses: result._sum.expenses,
    };
  }
}

export const balanceRepository = new BalanceRepository();
