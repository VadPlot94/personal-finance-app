import "server-only";
// From UI to Back-end

export type ICreateBudgetDTOInput = FormData;
export type IEditBudgetDTOInput = FormData;

// From Back-end to UI

export interface ICreateBudgetDTOOutput {
  id: string;
}

export interface IEditBudgetDTOOutput {
  id: string;
}

export interface IGetAllBudgetsDTOOutput {
  budgets: import("@prisma/client").Budget[];
}
