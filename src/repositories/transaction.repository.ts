
import prisma from '@/prisma/prisma-client';
import { BaseRepository } from './base.repository';
import { Transaction } from '@prisma/client';

export class TransactionRepository extends BaseRepository<typeof prisma.transaction> {
  constructor() {
    super(prisma.transaction);
  }

  async getRecent(limit = 10): Promise<Transaction[]> {
    return this.findMany({
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        amount: true,
        category: true,
        date: true,
        recurring: true,
      },
    });
  }

  async getByCategory(category: string): Promise<Transaction[]> {
    return this.findMany({
      where: { category },
      orderBy: { date: 'desc' },
    });
  }

  async createTransaction(data: {
    name: string;
    amount: number;
    category: string;
    date?: Date;
    recurring?: boolean;
  }): Promise<Transaction> {
    return this.create({
      data: {
        name: data.name,
        amount: data.amount,
        category: data.category,
        date: data.date ?? new Date(),
        recurring: data.recurring ?? false,
      },
    });
  }
}

export const transactionRepository = new TransactionRepository();
