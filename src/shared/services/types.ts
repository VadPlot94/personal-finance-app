import {
  Theme,
  TransactionType,
  TransactionUICategory,
} from "./constants.service";

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
