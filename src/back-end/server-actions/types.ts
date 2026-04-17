import {
  SortBy,
  TransactionUICategory,
} from "@/shared/services/constants.service";

export type ServerActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string | null | undefined;
  zodErrors?: Record<string, string>;
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
  userId?: string;
}

export interface IGetTransactionForCategoryParams {
  transactionsCount: number;
  categories?: TransactionUICategory[];
}

export interface IValidationResult {
  isValid: boolean;
  error?: string | null | undefined;
  errors?: Record<string, string>;
}
