"use server";

import { potRepository } from "@/repositories/pot.repository";
import { Pot } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPotServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
) {
  const potModel = getPotModel(formData);
  if (!potModel) {
    return { success: false };
  }

  potRepository.create({
    data: {
      name: potModel.name,
      target: potModel.target,
      theme: potModel.theme,
      total: potModel.total,
      userId: potModel.userId || null,
    },
  });

  syncChanges();
  return { success: true };
}

export async function editPotServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
) {
  const potModel = getPotModel(formData);
  if (!potModel) {
    return { success: false };
  }

  potRepository.update({
    where: { id: potModel.id },
    data: {
      name: potModel.name,
      target: potModel.target,
      theme: potModel.theme,
      total: potModel.total,
      userId: potModel.userId || null,
    },
  });

  syncChanges();
  return { success: true };
}

function getPotModel(formData: FormData) {
  if (!formData) {
    return null;
  }
  const potModel: Pot = {
    name: formData.get("potName") as string,
    target: Number(formData.get("target")?.toString()?.replaceAll(" ", "")),
    theme: (formData.get("theme") as string) || "white",
    total: Number(formData.get("total") || 0),
    userId: formData.get("userId") as string | null,
    id: formData.get("id") as string,
  };
  return potModel;
}

function syncChanges() {
  revalidatePath("/posts");
}
