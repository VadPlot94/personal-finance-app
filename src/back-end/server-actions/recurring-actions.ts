"use server";
import "server-only";

import recurringController from "@/back-end/controllers/recurring-controller";
import type { IGetTransactionsParams } from "@/shared/services/types";

export async function getAllRecurringSRF(
  data?: Partial<IGetTransactionsParams>,
) {
  return recurringController.getAllRecurring(data);
}

export async function deleteRecurringSRF(id: string) {
  return recurringController.deleteRecurring(id);
}
