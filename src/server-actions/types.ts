import { SortBy, TransactionUICategory } from "@/services/constants.service";

export type ServerActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface IGetTransactionsParams {
  page: number;
  transactionsCount: number;
  sortBy?: SortBy;
  order?: string;
  category?: TransactionUICategory;
  search?: string;
  isRecurring?: boolean;
}

export interface IGetTransactionForCategoryParams {
  transactionsCount: number;
  categories?: TransactionUICategory[];
}
