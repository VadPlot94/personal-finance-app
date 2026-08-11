import "server-only";
import { Balance } from "@prisma/client";
import prisma from "@/back-end/prisma/prisma-client";
import { balanceRepository } from "../repositories/balance.repository";

export async function getBalance(userId: string): Promise<Balance> {
  const currentBalance = await balanceRepository.getCurrent(userId);
  if (currentBalance) {
    return currentBalance;
  }

  return await recalculateBalance(userId);
}

export async function recalculateBalance(userId: string): Promise<Balance> {
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

export async function updateIncomeBalance(userId: string): Promise<Balance> {
  return await recalculateBalance(userId);
}

export async function updateExpensesBalance(userId: string): Promise<Balance> {
  return await recalculateBalance(userId);
}

export async function updateBalanceForTransaction(
  userId: string,
  amount: number,
): Promise<Balance> {
  return amount >= 0
    ? await updateIncomeBalance(userId)
    : await updateExpensesBalance(userId);
}
