import { Pot } from "@prisma/client";
import { Theme } from "@/shared/services/constants.service";

export interface IPotsProps {
  pots: Pot[];
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

export interface ICreatePotFormData {
  id: string;
  potName: string;
  target: string;
  theme: Theme;
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
