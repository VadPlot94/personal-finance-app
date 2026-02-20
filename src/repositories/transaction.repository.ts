import prisma from "@/prisma/prisma-client";
import { BaseRepository } from "./base.repository";
import { Transaction } from "@prisma/client";
import { IGetTransactionsParams } from "@/server-actions/types";
import { SortBy, TransactionCategory } from "@/services/constants.service";
import { ITransactionDataResponse } from "./types";

export class TransactionRepository extends BaseRepository<
  typeof prisma.transaction
> {
  constructor() {
    super(prisma.transaction);
  }

  public async getTransactions(
    params: IGetTransactionsParams,
  ): Promise<ITransactionDataResponse> {
    const { page, transactionsCount, category, order, sortBy } = params;
    const skip = (page - 1) * transactionsCount;
    const where = category ? { category } : {};
    const orderBy = { [sortBy as string]: order };
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take: transactionsCount,
    });

    const allTransactionsCount = await prisma.transaction.count({ where });

    return {
      transactions,
      paginationData: { allTransactionsCount, page, transactionsCount },
    };
  }

  async getRecent(limit = 10): Promise<Transaction[]> {
    return this.findMany({
      orderBy: { date: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        amount: true,
        category: true,
        avatar: true,
        date: true,
        recurring: true,
      },
    });
  }

  async getByCategory(category: string): Promise<Transaction[]> {
    return this.findMany({
      where: { category },
      orderBy: { date: "desc" },
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
