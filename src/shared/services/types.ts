import {
  Theme,
  TransactionType,
  TransactionUICategory,
} from "./constants.service";

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

export interface ICreateTransactionValidationData {
  transactionType?: TransactionType;
  category?: TransactionUICategory;
  recipientOrSender: string;
  amount: string;
  date?: string;
}
