import prisma from "@/back-end/prisma/prisma-client";
import { BaseRepository } from "./base.repository";
import { Balance } from "@prisma/client";

export class BalanceRepository extends BaseRepository<"balance"> {
  constructor() {
    super(prisma.balance);
  }

  /**
   * Получить текущий баланс (самый свежий по updatedAt)
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
   * Получить баланс по ID (если используешь фиксированный ID, например 'initial-balance')
   */
  async getById(id: string, userId: string): Promise<Balance | null> {
    return this.findFirst({
      where: { id, userId },
    });
  }

  /**
   * Обновить текущий баланс (если запись уже существует)
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
   * Создать или обновить баланс (upsert)
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
   * Получить общий доход / расход / баланс (агрегация)
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
