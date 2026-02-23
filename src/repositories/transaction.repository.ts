import prisma from "@/prisma/prisma-client";
import { BaseRepository } from "./base.repository";
import { Prisma, Transaction } from "@prisma/client";
import { IGetTransactionsParams } from "@/server-actions/types";
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
    const { page, transactionsCount, category, order, sortBy, search } = params;
    const skip = (page - 1) * transactionsCount;
    const orderBy = { [sortBy as string]: order };
    const searchVal = search?.trim();
    const where = {
      ...(category && { category }),
      ...(searchVal && {
        name: { contains: searchVal, mode: Prisma.QueryMode.insensitive },
      }),
    };

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
