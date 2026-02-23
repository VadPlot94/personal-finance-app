"use server";

import { Budget } from "@prisma/client";
import { IGetTransactionsParams, ServerActionResult } from "./types";
import { budgetRepository } from "@/repositories/budget.repository";

export async function getAllBudgetsServerAction(
  data?: Partial<IGetTransactionsParams>,
): Promise<ServerActionResult<Budget[]>> {
  try {
    const budgetsResponse = await budgetRepository.getAll();

    return {
      success: true,
      data: budgetsResponse,
      message: "Budgets get successfully",
    };
  } catch (error) {
    console.error("Error getting budgets:", error);
    return {
      success: false,
      error: "Failed to get budgets. Please try again.",
    };
  }
}
