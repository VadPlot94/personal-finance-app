import { SortBy, TransactionCategory } from "@/services/constants.service";

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
  category?: TransactionCategory;
}
