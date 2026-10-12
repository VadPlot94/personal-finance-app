"use server";
import "server-only";

import budgetController from "@/back-end/controllers/budget-controller";

export async function addBudgetSRF(
  _prevState: { success: boolean } | null,
  formData: FormData,
) {
  return budgetController.addBudget(_prevState, formData);
}

export async function editBudgetSRF(
  _prevState: { success: boolean } | null,
  formData: FormData,
) {
  return budgetController.editBudget(_prevState, formData);
}

export async function deleteBudgetSRF(id: string | null | undefined) {
  return budgetController.deleteBudget(id);
}
