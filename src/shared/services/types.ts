import type { Transaction } from "@prisma/client";
import type {
  SortBy,
  Theme,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";

export interface ISideBarMenuItem {
  href: string;
  iconUrl: string;
  title: string;
  isAccount?: boolean;
}

export interface ICreatePotValidationData {
  id: string;
  potName: string;
  target: string;
  theme: Theme;
}

export interface IAddBudgetValidationData {
  id: string;
  budgetCategory: string;
  maximum: string;
  theme: Theme;
}

/** Form-facing aliases of validation shapes (shared FE + BE). */
export type ICreatePotFormData = ICreatePotValidationData;
export type IAddBudgetFormData = IAddBudgetValidationData;

export interface ICreateTransactionValidationData {
  transactionType?: TransactionType;
  category?: TransactionUICategory;
  recipientOrSender: string;
  amount: string;
  date?: string;
}

export interface ISignInValidationData {
  email: string;
  password: string;
}

export interface ISignInFormData extends ISignInValidationData {
  // Form-specific data structure matching the sign in fields
}

export interface IRegisterValidationData {
  email: string;
  password: string;
  name: string;
}

export interface IRegisterFormData extends IRegisterValidationData {
  // Form-specific data structure matching the register fields
}

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
