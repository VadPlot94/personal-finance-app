import { randomBytes, scryptSync } from "crypto";
import prisma from "@/back-end/prisma/prisma-client";
import { userRepository } from "@/back-end/DAL/repositories/user.repository";
const data = require("@/../initial-data/data.json");

const DEFAULT_EMAIL = process.env.AUTH_EMAIL || "admin@example.com";
const DEFAULT_PASSWORD = process.env.AUTH_PASSWORD || "password";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function main() {
  const hashedPassword = hashPassword(DEFAULT_PASSWORD);
  const user = await userRepository.upsertByEmail({
    email: DEFAULT_EMAIL,
    name: "Finance Admin",
    hashedPassword,
  });

  const userId = user.id;

  await prisma.balance.upsert({
    where: { id: "initial-balance" },
    update: {
      userId,
    },
    create: {
      id: "initial-balance",
      current: data.balance.current,
      income: data.balance.income,
      expenses: data.balance.expenses,
      userId,
    },
  });

  await prisma.transaction.createMany({
    data: data.transactions.map((t: any) => ({ ...t, userId })),
  });

  await prisma.budget.createMany({
    data: data.budgets.map((b: any) => ({ ...b, userId })),
  });

  await prisma.pot.createMany({
    data: data.pots.map((p: any) => ({ ...p, userId })),
  });

  console.log("Seed completed");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
