import prisma from "@/back-end/prisma/prisma-client";
import userService from "@/back-end/DAL/db-services/user.service";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";
import { budgetRepository } from "@/back-end/DAL/repositories/budget.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import constants from "@/shared/services/constants.service";

const data = require("@/../initial-data/data.json");

export async function setTestAppData() {
  try {
    if (!constants.AuthEmail || !constants.AuthPassword) {
      console.error(
        "AUTH_EMAIL and AUTH_PASSWORD environment variables are not set",
      );
      process.exit(1);
    }
    const user = await userService.createAdminUser(
      constants.AuthEmail,
      constants.AuthPassword,
    );

    const userId = user.id;

    await balanceRepository.upsertBalance({
      userId,
      current: data.balance.current,
      income: data.balance.income,
      expenses: data.balance.expenses,
    });

    await Promise.all(
      data.transactions.map((transaction: any) =>
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
      data.budgets.map((budget: any) =>
        budgetRepository.upsertBudget({
          userId,
          category: budget.category,
          maximum: budget.maximum,
          theme: budget.theme,
        }),
      ),
    );

    await Promise.all(
      data.pots.map((pot: any) =>
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
  } finally {
    await prisma.$disconnect();
  }
}

// Not run more from package.json script, because we want to run it only on first admin login if database is empty
// so we can test app features without manual adding data after each reset
// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());
