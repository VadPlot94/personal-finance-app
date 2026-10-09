import "server-only";
import type { Budget, Pot, Transaction } from "@prisma/client";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { budgetRepository } from "@/back-end/DAL/repositories/budget.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";

const data = require("@/../initial-data/data.json");

export async function setTestAppData(userId: string) {
  try {
    await balanceRepository.upsertBalance({
      userId,
      current: data.balance.current,
      income: data.balance.income,
      expenses: data.balance.expenses,
    });

    await Promise.all(
      data.transactions.map((transaction: Transaction) =>
        transactionRepository.createTransaction({
          userId,
          name: transaction.name,
          avatar: transaction.avatar,
          amount: transaction.amount,
          category: transaction.category,
          date: new Date(transaction.date),
          recurring: transaction.recurring,
        }),
      ),
    );

    await Promise.all(
      data.budgets.map((budget: Budget) =>
        budgetRepository.upsertBudget({
          userId,
          category: budget.category,
          maximum: budget.maximum,
          theme: budget.theme,
        }),
      ),
    );

    await Promise.all(
      data.pots.map((pot: Pot) =>
        potRepository.createPot({
          userId,
          name: pot.name,
          target: pot.target,
          total: pot.total,
          theme: pot.theme,
        }),
      ),
    );

    console.log("Seed completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Seed runs on first admin login (auth.service), not via package.json scripts.
