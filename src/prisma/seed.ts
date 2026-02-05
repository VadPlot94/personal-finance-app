import prisma from '@/prisma/prisma-client';
const data = require('@/../initial-data/data.json');

async function main() {
  await prisma.balance.upsert({
    where: { id: 'initial-balance' },
    update: {},
    create: {
      id: 'initial-balance',
      current: data.balance.current,
      income: data.balance.income,
      expenses: data.balance.expenses,
    },
  });

  await prisma.transaction.createMany({
    data: data.transactions.map((t: any) => ({ ...t })),
  });

  await prisma.budget.createMany({
    data: data.budgets.map((b: any) => ({ ...b })),
  });

  await prisma.pot.createMany({
    data: data.pots.map((p: any) => ({ ...p })),
  });

  console.log('Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());