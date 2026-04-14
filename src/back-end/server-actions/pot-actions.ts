"use server";

import { revalidatePath } from "next/cache";
import { ServerActionResult } from "./types";
import {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "../dto-models/pot-dto.model";
import {
  createPot,
  deletePot,
  editPot,
  setPotTotal,
} from "../DAL/business-logic/pot-db.service";
import { validationObjectWrapper } from "./common";

export async function createPotServerAction(
  prevState: { success: boolean } | null,
  formData: ICreatePotDTOInput,
): Promise<ServerActionResult<ICreatePotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<ICreatePotDTOOutput>(
    "create",
    async () => {
      // check auth()
      return createPot(formData);
    },
  );

  syncChanges();
  return validatedResponse;
}

export async function editPotServerAction(
  prevState: { success: boolean } | null,
  formData: IEditPotDTOInput,
): Promise<ServerActionResult<IEditPotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<IEditPotDTOOutput>(
    "update",
    async () => {
      // check auth()
      return editPot(formData);
    },
  );

  syncChanges();
  return validatedResponse;
}

export async function deletePotServerAction(
  id: string,
): Promise<ServerActionResult> {
  const validatedResponse = await validationObjectWrapper<boolean>(
    "delete",
    async () => {
      // check auth()
      return deletePot(id);
    },
  );

  syncChanges();
  return validatedResponse;
}

export async function setPotTotalServerAction(
  id: string,
  newTotal: number,
): Promise<ServerActionResult<IEditPotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<IEditPotDTOOutput>(
    "update",
    async () => {
      // check auth()
      return setPotTotal(id, newTotal);
    },
  );

  syncChanges();
  return validatedResponse;
}

function syncChanges() {
  revalidatePath("/pots");
}
