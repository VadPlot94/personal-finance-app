"use server";
import "server-only";

import potController from "@/back-end/controllers/pot-controller";

export async function getAllPotsSRF() {
  return potController.getAllPots();
}

export async function createPotSRF(
  _prevState: { success: boolean } | null,
  formData: FormData,
) {
  return potController.createPot(_prevState, formData);
}

export async function editPotSRF(
  _prevState: { success: boolean } | null,
  formData: FormData,
) {
  return potController.editPot(_prevState, formData);
}

export async function deletePotSRF(id: string) {
  return potController.deletePot(id);
}

export async function setPotTotalSRF(id: string, newTotal: number) {
  return potController.setPotTotal(id, newTotal);
}
