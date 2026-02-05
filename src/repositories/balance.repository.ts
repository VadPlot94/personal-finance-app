
import prisma from '@/prisma/prisma-client';
import { BaseRepository } from './base.repository';
import { Balance } from '@prisma/client';

export class BalanceRepository extends BaseRepository<typeof prisma.balance> {
  constructor() {
    super(prisma.balance);
  }

  /**
   * Получить текущий баланс (самый свежий по updatedAt)
   */
  async getCurrent(): Promise<Balance | null> {
    return this.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Получить баланс по ID (если используешь фиксированный ID, например 'initial-balance')
   */
  async getById(id: string): Promise<Balance | null> {
    return this.findUnique({
      where: { id },
    });
  }

  /**
   * Обновить текущий баланс (если запись уже существует)
   */
  async updateBalance(id: string, data: {
    current?: number;
    income?: number;
    expenses?: number;
  }): Promise<Balance> {
    return this.update({
      where: { id },
      data,
    });
  }

  /**
   * Создать или обновить баланс (upsert)
   */
  async upsertBalance(data: {
    id: string;
    current: number;
    income: number;
    expenses: number;
  }): Promise<Balance> {
    return this.upsert({
      where: { id: data.id },
      update: {
        current: data.current,
        income: data.income,
        expenses: data.expenses,
      },
      create: {
        id: data.id,
        current: data.current,
        income: data.income,
        expenses: data.expenses,
      },
    });
  }

  /**
   * Получить общий доход / расход / баланс (агрегация)
   */
  async getSummary(): Promise<{
    current: number | null;
    totalIncome: number | null;
    totalExpenses: number | null;
  }> {
    const result = await prisma.balance.aggregate({
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