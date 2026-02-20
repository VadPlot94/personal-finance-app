"use server";

import { potRepository } from "@/repositories/pot.repository";
import { Theme } from "@/services/constants.service";
import { Pot } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "./types";

export async function addPotServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult> {
  try {
    const potModel = getPotModel(formData);
    if (!potModel || !potModel.name || !potModel.target) {
      return {
        success: false,
        error: "Invalid data: name and target are required",
      };
    }

    const isNameUnique = await potRepository.isNameUnique(
      potModel.name,
      potModel.id,
    );

    if (!isNameUnique) {
      return { success: false, error: "Pot with such name already exist" };
    }

    await potRepository.create({
      data: {
        name: potModel.name,
        target: potModel.target,
        total: potModel.total,
        theme: potModel.theme as Theme,
        userId: potModel.userId || null,
      },
    });

    syncChanges();
    return { success: true, message: "Pot created successfully" };
  } catch (error) {
    console.error("Error creating pot:", error);
    return { success: false, error: "Failed to create pot. Please try again." };
  }
}

export async function editPotServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult> {
  try {
    const potModel = getPotModel(formData);
    if (!potModel || !potModel.id) {
      return { success: false, error: "ID is required for update" };
    }

    if (Object.keys(potModel).length === 0) {
      return { success: true, message: "No changes to apply" };
    }

    const isNameUnique = await potRepository.isNameUnique(
      potModel.name,
      potModel.id,
    );

    if (!isNameUnique) {
      return { success: false, error: "Pot with such name already exist" };
    }

    await potRepository.update({
      where: { id: potModel.id },
      data: {
        name: potModel.name,
        target: potModel.target,
        theme: potModel.theme,
      },
    });
    syncChanges();

    return { success: true, message: "Pot updated successfully" };
  } catch (error) {
    console.error("Error updating pot:", error);
    return { success: false, error: "Failed to update pot. Please try again." };
  }
}

export async function deletePotServerAction(
  id: string,
): Promise<ServerActionResult> {
  try {
    if (!id) {
      return { success: false, error: "ID is required" };
    }

    await potRepository.delete({
      where: { id },
    });

    syncChanges();

    return { success: true, message: "Pot deleted successfully" };
  } catch (error) {
    console.error("Error deleting pot:", error);
    return { success: false, error: "Failed to delete pot. Please try again." };
  }
}

export async function setPotTotalServerAction(
  id: string,
  newTotal: number,
): Promise<ServerActionResult> {
  try {
    if (!id) {
      return { success: false, error: "ID and total data are required" };
    }

    if (isNaN(newTotal)) {
      return { success: false, error: "Total must be a valid number" };
    }

    await potRepository.update({
      where: { id },
      data: { total: newTotal },
    });

    syncChanges();

    return { success: true, message: "Pot total was updated successfully" };
  } catch (error) {
    console.error("Error update pot total:", error);
    return {
      success: false,
      error: "Failed to update pot total. Please try again.",
    };
  }
}

function getPotModel(formData: FormData): Partial<Pot> | null {
  if (!formData) return null;

  const potModel: Partial<Pot> = {
    name: formData.get("potName") as string | undefined,
    target: Number(
      formData.get("target")?.toString()?.replaceAll(" ", "") || 0,
    ),
    theme: (formData.get("theme") as Theme) || Theme.NavyGrey,
    total: Number(formData.get("total") || 0),
    userId: formData.get("userId") as string | null,
    id: formData.get("id") as string | undefined,
  };

  Object.keys(potModel).forEach(
    (key) =>
      potModel[key as keyof Partial<Pot>] === undefined &&
      delete potModel[key as keyof Partial<Pot>],
  );

  return potModel;
}

function syncChanges() {
  revalidatePath("/pots");
}
