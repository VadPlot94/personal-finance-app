import prisma from "@/back-end/prisma/prisma-client";
import { BaseRepository } from "./base.repository";
import { Budget } from "@prisma/client";

export class BudgetRepository extends BaseRepository<"budget"> {
  constructor() {
    super(prisma.budget);
  }

  /**
   * Получить все бюджеты (с сортировкой по категории)
   */
  async getAll(): Promise<Budget[]> {
    return this.findMany({
      orderBy: { category: "asc" },
    });
  }

  /**
   * Получить бюджет по категории
   */
  async getByCategory(category: string): Promise<Budget | null> {
    return this.findFirst({
      where: { category },
    });
  }

  /**
   * Checks if a category can be used for a budget.
   * - When creating (no id provided): the category must not exist at all.
   * - When editing (id provided): the category must not be used by any other budget (excluding the current one).
   */
  public async isCategoryUnique(
    category: string | undefined,
    excludeId?: string,
  ): Promise<boolean> {
    const budget = await this.findFirst({
      where: {
        category,
        // If id is provided — exclude the current pot from the check
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: { id: true }, // minimal data
    });

    return !budget; // true = category is available, false = category is taken
  }

  /**
   * Создать или обновить бюджет (upsert)
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
      }, // предполагаем уникальность по category
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
   * Получить общую сумму максимальных бюджетов
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
