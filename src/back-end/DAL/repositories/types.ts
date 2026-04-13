import { TransactionUICategory } from "@/shared/services/constants.service";
import { Transaction } from "@prisma/client";

export interface ITransactionDataResponse {
  transactions: Transaction[];
  paginationData: {
    allTransactionsCount: number;
    page: number;
    transactionsCount: number;
  };
}

export interface ITransactionsForCategoryData {
  category: TransactionUICategory;
  transactions: Transaction[];
}
