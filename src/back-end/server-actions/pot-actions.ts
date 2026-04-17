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
} from "../DAL/db-services/pot-db.service";
import { validationObjectWrapper } from "./common";
import { Session } from "next-auth";

export async function createPotServerAction(
  prevState: { success: boolean } | null,
  formData: ICreatePotDTOInput,
): Promise<ServerActionResult<ICreatePotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<ICreatePotDTOOutput>(
    "create",
    async (session?: Session) => {
      return createPot(formData, session?.user?.id);
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
    async (session?: Session) => {
      return editPot(formData, session?.user?.id);
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
    async (session?: Session) => {
      return deletePot(id, session?.user?.id);
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
    async (session?: Session) => {
      return setPotTotal(id, newTotal, session?.user?.id);
    },
  );

  syncChanges();
  return validatedResponse;
}

function syncChanges() {
  revalidatePath("/pots");
}
