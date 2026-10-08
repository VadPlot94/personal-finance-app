"use server";
import "server-only";

import type { Pot } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import {
  createPot,
  deletePot,
  editPot,
  getAllPots,
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

export async function getAllPotsServerAction(): Promise<
  ServerActionResult<Pot[]>
> {
  return await validationObjectWrapper<Pot[]>(
    "get",
    async (session?: Session) => {
      return getAllPots(session?.user?.id!);
    },
  );
}

export async function createPotServerAction(
  _prevState: { success: boolean } | null,
  formData: ICreatePotDTOInput,
): Promise<ServerActionResult<ICreatePotDTOOutput>> {
  return await validationObjectWrapper<ICreatePotDTOOutput>(
    "create",
    async (session?: Session) => {
      const result = await createPot(formData, session?.user?.id!);
      syncChanges();
      return result;
    },
  );
}

export async function editPotServerAction(
  _prevState: { success: boolean } | null,
  formData: IEditPotDTOInput,
): Promise<ServerActionResult<IEditPotDTOOutput>> {
  return await validationObjectWrapper<IEditPotDTOOutput>(
    "update",
    async (session?: Session) => {
      const result = await editPot(formData, session?.user?.id!);
      syncChanges();
      return result;
    },
  );
}

export async function deletePotServerAction(
  id: string,
): Promise<ServerActionResult> {
  return await validationObjectWrapper<boolean>(
    "delete",
    async (session?: Session) => {
      const result = await deletePot(id, session?.user?.id!);
      syncChanges();
      return result;
    },
  );
}

export async function setPotTotalServerAction(
  id: string,
  newTotal: number,
): Promise<ServerActionResult<IEditPotDTOOutput>> {
  return await validationObjectWrapper<IEditPotDTOOutput>(
    "update",
    async (session?: Session) => {
      const result = await setPotTotal(id, newTotal, session?.user?.id!);
      syncChanges();
      return result;
    },
  );
}

function syncChanges() {
  revalidatePath("/pots");
}
