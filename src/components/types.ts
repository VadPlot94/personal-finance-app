import { Pot } from "@prisma/client";

export interface IPotsProps {
  pots: Pot[];
}

export interface IPotItemProps {
  pot: Pot;
}
