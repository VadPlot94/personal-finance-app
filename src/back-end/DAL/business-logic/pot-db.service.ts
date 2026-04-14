import validationService from "@/shared/services/validation.service";
import { Pot } from "@prisma/client";
import { potRepository } from "../repositories/pot.repository";
import { CustomError } from "@/back-end/server-actions/common";
import {
  mapCreateDBPotToOutput,
  mapCreatePotInputToDBPot,
  mapEditDBPotToOutput,
  mapEditPotInputToDBPot,
} from "@/back-end/mappers/pot-mapper";
import {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "@/back-end/dto-models/pot-dto.model";
import { ICreatePotFormData } from "@/front-end/components/pots/types";
import { ZodSafeParseResult } from "zod";
import { balanceRepository } from "../repositories/balance.repository";
import potService from "@/front-end/services/pot.service";

export async function createPot(
  potFormData: ICreatePotDTOInput,
): Promise<ICreatePotDTOOutput> {
  const potModel = mapCreatePotInputToDBPot(potFormData) as Pot;
  await validateCreatePotModel(potModel);

  const response = await potRepository.create({
    data: {
      ...potModel,
    },
    select: {
      id: true,
    },
  });

  return mapCreateDBPotToOutput(response);
}

export async function editPot(
  potFormData: IEditPotDTOInput,
): Promise<IEditPotDTOOutput> {
  const potModel = mapEditPotInputToDBPot(potFormData) as Pot;
  await validateEditPotModel(potModel);

  const response = await potRepository.update({
    where: { id: potModel.id },
    data: {
      name: potModel.name,
      target: potModel.target,
      theme: potModel.theme,
    },
  });

  return mapEditDBPotToOutput(response);
}

export async function deletePot(id: string): Promise<boolean> {
  validateDeletePotModel(id);

  const response = await potRepository.delete({
    where: { id },
  });

  return id === response?.id;
}

export async function setPotTotal(
  id: string,
  newTotal: number,
): Promise<IEditPotDTOOutput> {
  await validatePotTotal(id, newTotal);

  const response = await potRepository.update({
    where: { id },
    data: { total: newTotal },
  });

  return mapEditDBPotToOutput(response);
}

async function validatePotTotal(
  id: string,
  newTotal: number,
): Promise<boolean> {
  if (!id) {
    throw new CustomError("ID is required for update");
  }

  if (newTotal === 0 || isNaN(newTotal)) {
    const zodErrorResult = validationService.createCustomZodIssueResult<object>(
      "total",
      "Total must be a valid positive number",
    );
    throwValidationError(zodErrorResult);
  }

  const pots = await potRepository.getAll();
  const currentPot = pots?.find((pot) => pot?.id === id);

  if (!currentPot) {
    throw new CustomError("There is no such Pot");
  }

  const { target, total } = currentPot;

  const isWithdraw = newTotal < total;
  const targetValidationAmount = isWithdraw ? total : target;
  const oldTotal = isWithdraw ? 0 : total;
  const balance = await balanceRepository.getCurrent();
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance?.current - totalSum || 0;
  const deltaAmount = Math.abs(newTotal - total);

  const zodValidationResult = validationService.validateTotal(
    deltaAmount.toString(),
    targetValidationAmount,
    oldTotal,
    availableBalance,
  );

  throwValidationError(zodValidationResult);

  return true;
}

function validateDeletePotModel(id: string) {
  if (!id) {
    throw new CustomError("ID is required for deletion");
  }
}

async function validateEditPotModel(
  potModel: Partial<Pot> | null,
): Promise<never | boolean> {
  if (!potModel?.id) {
    throw new CustomError("ID is required for update");
  }
  return validateCreatePotModel(potModel);
}

async function validateCreatePotModel(
  potModel: Partial<Pot> | null,
): Promise<never | boolean> {
  if (!potModel?.name) {
    const zodErrorResult = validationService.createCustomZodIssueResult<object>(
      "potName" as ICreatePotFormData["potName"],
      "Invalid data: pot name is required",
    );
    throwValidationError(zodErrorResult);
  }
  if (!potModel?.target) {
    const zodErrorResult = validationService.createCustomZodIssueResult<object>(
      "target" as ICreatePotFormData["target"],
      "Invalid data: target is required",
    );
    throwValidationError(zodErrorResult);
  }

  const isNameUnique = await potRepository.isUnique(
    "name",
    potModel?.name,
    potModel?.id,
  );

  if (!isNameUnique) {
    const zodErrorResult = validationService.createCustomZodIssueResult<object>(
      "potName" as ICreatePotFormData["potName"],
      "Pot with such name already exist",
    );
    throwValidationError(zodErrorResult);
  }

  const zodValidationResult = validationService.validateCreatePotSchemaServer(
    potModel as Pot,
  );

  throwValidationError(zodValidationResult);
  return true;
}

function throwValidationError<T>(
  zodValidationResult: ZodSafeParseResult<T>,
): void {
  if (!zodValidationResult?.success) {
    const errors = validationService.createErrorsWithPath<T>(
      zodValidationResult,
    ) as Record<keyof T, string>;
    throw new CustomError("Validation error", errors);
  }
}
