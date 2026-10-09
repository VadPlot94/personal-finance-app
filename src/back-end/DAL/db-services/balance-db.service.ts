import "server-only";
import type { Balance } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import prisma from "@/back-end/prisma/prisma-client";

export async function getBalance(userId: string): Promise<Balance> {
  "use cache";
  cacheTag(balanceTag(userId));
  cacheLife("minutes");

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
