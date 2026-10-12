"use server";
import "server-only";

import balanceController from "@/back-end/controllers/balance-controller";

export async function getBalanceSRF() {
  return balanceController.getBalance();
}
