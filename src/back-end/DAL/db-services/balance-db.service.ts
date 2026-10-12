import "server-only";
import type { Balance } from "@prisma/client";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import type { IBalanceDTOOutput } from "@/back-end/dto-model-types/balance-dto-model.type";
import balanceMapper from "@/back-end/mappers/balance-mapper";
import prisma from "@/back-end/prisma/prisma-client";

class BalanceDbService {
  public async getBalance(userId: string): Promise<IBalanceDTOOutput> {
    const currentBalance = await balanceRepository.getCurrent(userId);
    if (currentBalance) {
      return balanceMapper.mapBalanceToOutput(currentBalance);
    }

    const recalculated = await this.recalculateBalance(userId);
    return balanceMapper.mapBalanceToOutput(recalculated);
  }

  public async recalculateBalance(userId: string): Promise<Balance> {
    const incomeResult = await prisma.transaction.aggregate({
      where: { userId, amount: { gt: 0 } },
      _sum: { amount: true },
    });

    const expensesResult = await prisma.transaction.aggregate({
      where: { userId, amount: { lt: 0 } },
      _sum: { amount: true },
    });

    const income = incomeResult._sum.amount ?? 0;
    const expenses = Math.abs(expensesResult._sum.amount ?? 0);
    const current = income - expenses;

    return await balanceRepository.upsertBalance({
      userId,
      current,
      income,
      expenses,
    });
  }

  public async updateIncomeBalance(userId: string): Promise<Balance> {
    return await this.recalculateBalance(userId);
  }

  public async updateExpensesBalance(userId: string): Promise<Balance> {
    return await this.recalculateBalance(userId);
  }

  public async updateBalanceForTransaction(
    userId: string,
    amount: number,
  ): Promise<Balance> {
    return amount >= 0
      ? await this.updateIncomeBalance(userId)
      : await this.updateExpensesBalance(userId);
  }
}

const balanceDbService = new BalanceDbService();
export default balanceDbService;
