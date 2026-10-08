"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import {
  createPot,
  deletePot,
  editPot,
  setPotTotal,
} from "@/back-end/DAL/db-services/pot-db.service";
import type {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "@/back-end/dto-models/pot-dto.model";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";

export async function createPotServerAction(
  _prevState: { success: boolean } | null,
  formData: ICreatePotDTOInput,
): Promise<ServerActionResult<ICreatePotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<ICreatePotDTOOutput>(
    "create",
    async (session?: Session) => {
      return createPot(formData, session?.user?.id!);
    },
  );

  syncChanges();
  return validatedResponse;
}

export async function editPotServerAction(
  _prevState: { success: boolean } | null,
  formData: IEditPotDTOInput,
): Promise<ServerActionResult<IEditPotDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<IEditPotDTOOutput>(
    "update",
    async (session?: Session) => {
      return editPot(formData, session?.user?.id!);
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
      return deletePot(id, session?.user?.id!);
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
      return setPotTotal(id, newTotal, session?.user?.id!);
    },
  );

  syncChanges();
  return validatedResponse;
}

function syncChanges() {
  revalidatePath("/pots");
}
