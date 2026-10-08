import "server-only";
import type { Budget } from "@prisma/client";
import { BaseRepository } from "@/back-end/DAL/repositories/base.repository";
import prisma from "@/back-end/prisma/prisma-client";

export class BudgetRepository extends BaseRepository<"budget"> {
  constructor() {
    super(prisma.budget);
  }

  /**
   * Get all budgets (sorted by category)
   */
  async getAll(userId: string): Promise<Budget[]> {
    return this.findMany({
      where: { userId },
      orderBy: { category: "asc" },
    });
  }

  /**
   * Get budget by category
   */
  async getByCategory(
    category: string,
    userId: string,
  ): Promise<Budget | null> {
    return this.findFirst({
      where: { category, userId },
    });
  }

  /**
   * Create or update a budget (upsert)
   */
  async upsertBudget(data: {
    userId: string;
    category: string;
    maximum: number;
    theme: string;
  }): Promise<Budget> {
    return this.upsert({
      where: {
        userId_category: { userId: data.userId, category: data.category },
      }, // assume uniqueness by category
      update: {
        maximum: data.maximum,
        theme: data.theme,
      },
      create: {
        category: data.category,
        maximum: data.maximum,
        theme: data.theme,
      },
    });
  }

  /**
   * Get the total of all budget maximums
   */
  async getTotalMaximum(): Promise<number | null> {
    const result = await prisma.budget.aggregate({
      _sum: {
        maximum: true,
      },
    });
    return result._sum.maximum;
  }
}

export const budgetRepository = new BudgetRepository();
