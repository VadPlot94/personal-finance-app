import prisma from "@/back-end/prisma/prisma-client";
import { BaseRepository } from "./base.repository";
import { Prisma, Transaction } from "@prisma/client";
import { IGetTransactionsParams } from "@/back-end/server-actions/types";
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
    const {
      page,
      transactionsCount,
      category,
      order,
      sortBy,
      search,
      isRecurring,
    } = params;

    const skip = (page - 1) * transactionsCount;
    const orderBy = { [sortBy as string]: order };
    const searchVal = search?.trim();
    const where = {
      ...(category && { category }),
      ...(searchVal && {
        name: { contains: searchVal, mode: Prisma.QueryMode.insensitive },
      }),
      ...(isRecurring && { recurring: true }),
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

  public async getMonthlyExpensesByCategory(
    userId: string,
  ): Promise<Transaction[]> {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const userBudgets = await prisma.budget.findMany({
      where: { userId },
      select: { category: true },
    });

    const budgetCategories = userBudgets.map((b) => b.category);

    if (budgetCategories.length === 0) {
      return [];
    }

    const expenses = await prisma.transaction.findMany({
      where: {
        userId,
        amount: { lt: 0 },
        category: { in: budgetCategories },
        // ! This can be activated when we will have current month transactions
        // ! But data json has only old transactions then we proceed without date
        // date: {
        //   gte: startOfMonth,
        //   lt: endOfMonth,
        // },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        date: true,
        avatar: true,
        recurring: true,
        category: true,
      },
      orderBy: [{ date: "desc" }, { amount: "asc" }],
    });

    return expenses as Transaction[];
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

  public async createTransaction(
    data: Omit<Transaction, "id" | "userId">,
  ): Promise<Transaction> {
    return this.create({
      data: {
        name: data.name,
        avatar: data.avatar,
        amount: data.amount,
        category: data.category,
        date: data.date ?? new Date(),
        recurring: data.recurring ?? false,
      },
    });
  }
}

export const transactionRepository = new TransactionRepository();
