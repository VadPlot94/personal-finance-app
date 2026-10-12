import "server-only";

export interface IBalanceDTOOutput {
  id: string;
  current: number;
  income: number;
  expenses: number;
}
