
import prisma from '@/prisma/prisma-client';
import { BaseRepository } from './base.repository';
import { Budget } from '@prisma/client';

export class BudgetRepository extends BaseRepository<typeof prisma.budget> {
  constructor() {
    super(prisma.budget);
  }

  /**
   * Получить все бюджеты (с сортировкой по категории)
   */
  async getAll(): Promise<Budget[]> {
    return this.findMany({
      orderBy: { category: 'asc' },
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
   * Создать или обновить бюджет (upsert)
   * Если запись уже существует (по уникальному ключу) → обнови её (update)
   * Если записи нет → создай новую (insert)
   */
  async upsertBudget(data: {
    userId: string;
    category: string;
    maximum: number;
    theme: string;
  }): Promise<Budget> {
    return this.upsert({
      where: { userId_category: { userId: data.userId, category: data.category } }, // предполагаем уникальность по category
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