import { Transaction } from "@prisma/client";

export interface ITransactionDataResponse {
  transactions: Transaction[];
  paginationData: {
    allTransactionsCount: number;
    page: number;
    transactionsCount: number;
  };
}
