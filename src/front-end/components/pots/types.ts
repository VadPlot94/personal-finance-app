import type { Pot } from "@prisma/client";

export interface IPotsProps {
  pots?: Pot[] | null;
  availableBalance: number;
}

export interface IPotsTileProps {
  pots: Pot[];
}

export interface IPotsItemProps {
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

export interface IPotsMenuProps {
  pot: Pot;
  children: React.ReactNode;
}

export interface IDeletePotDialogProps {
  pot: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}
