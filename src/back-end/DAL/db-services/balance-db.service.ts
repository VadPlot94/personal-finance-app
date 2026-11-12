import "server-only";
import type { Balance } from "@prisma/client";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import type { IBalanceDTOOutput } from "@/back-end/dto-model-types/balance-dto-model.type";
import balanceMapper from "@/back-end/mappers/balance-mapper";
import prisma from "@/back-end/prisma/prisma-client";
import balanceService from "@/shared/services/balance.service";

class BalanceDbService {
  public async getBalance(userId: string): Promise<IBalanceDTOOutput> {
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

    const { current, income, expenses } = balanceService.computeFromSums(
      incomeResult._sum.amount ?? 0,
      Math.abs(expensesResult._sum.amount ?? 0),
    );

    return await balanceRepository.upsertBalance({
      userId,
      current,
      income,
      expenses,
    });
  }
}

const balanceDbService = new BalanceDbService();
export default balanceDbService;
