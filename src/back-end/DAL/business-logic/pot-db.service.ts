import { IValidationResult } from "@/back-end/server-actions/types";
import validationService from "@/shared/services/validation.service";
import { Pot } from "@prisma/client";
import { potRepository } from "../repositories/pot.repository";
import { CustomError } from "@/back-end/server-actions/common";

export async function validateCreatePotModel(
  potModel: Partial<Pot> | null,
): Promise<never | boolean> {
  const isValid = potModel?.name && potModel?.target;
  if (!isValid) {
    throw new CustomError("Invalid data: name and target are required");
  }

  const isNameUnique = await potRepository.isUnique(
    "name",
    potModel.name,
    potModel.id,
  );

  if (!isNameUnique) {
    throw new CustomError("Pot with such name already exist");
  }

  const zodValidationResult =
    validationService.validateCreatePotSchemaServer(potModel);

  if (!zodValidationResult || !zodValidationResult.success) {
    const errors =
      validationService.createErrorsWithPath<Partial<Pot>>(zodValidationResult);
    throw new CustomError("Validation error", errors);
  }
  return true;
}
