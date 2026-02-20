import { Theme } from "@/services/constants.service";
import { Pot, Transaction } from "@prisma/client";

export interface IPotsProps {
  pots: Pot[];
  availableBalance: number;
}

export interface IPotsTileProps {
  pots: Pot[];
}

export interface IPotItemProps {
  pot: Pot;
  availableBalance: number;
}

export interface IAddMoneyPotDialogProps {
  children?: React.ReactNode;
  pot: Pot;
  availableBalance: number;
  isWithdraw?: boolean;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IEditPotDialogProps {
  children?: React.ReactNode;
  pot?: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IAddPotFormData {
  id: string;
  potName: string;
  target: string;
  theme: Theme;
}

export interface IPotMenuProps {
  pot: Pot;
  children: React.ReactNode;
}

export interface IPaginationData {
  page: number;
  transactionsCount: number;
  allTransactionsCount: number;
}

export interface ITransactionsProps {
  transactions: Transaction[] | undefined;
  paginationData: IPaginationData | undefined;
}
