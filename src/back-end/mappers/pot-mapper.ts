import { Pot } from "@prisma/client";
import { IAddPotDTOInput, IAddPotDTOOutput } from "../dto-models/pot-dto.model";
import { Theme } from "@/front-end/services/constants.service";

export function mapCreatePotInputToDBPot(
  input: IAddPotDTOInput,
): Partial<Pot> | null {
  const potModel = getPotModel(input);
  return potModel;
}

export function mapCreateDBPotToOutput(
  dbPOutput: IAddPotDTOOutput,
): IAddPotDTOOutput {
  return { id: dbPOutput?.id };
}

function getPotModel(formData: FormData): Partial<Pot> | null {
  if (!formData) {
    return null;
  }

  const potModel: Partial<Pot> = {
    id: formData.get("id") as string,
    userId: formData.get("userId") as string | null,
    name: formData.get("potName") as string,
    target: Number(
      formData.get("target")?.toString()?.replaceAll(" ", "") || 0,
    ),
    theme: (formData.get("theme") as Theme) || Theme.NavyGrey,
    total: Number(formData.get("total") || 0),
  };

  return removeUndefinedFields(potModel);
}

function removeUndefinedFields<T>(obj: T): Partial<T> {
  const cleanedObj: Partial<T> = { ...obj };
  Object.keys(cleanedObj).forEach((key) => {
    const value = cleanedObj[key as keyof Partial<T>];
    if (value === undefined || value === null) {
      delete cleanedObj[key as keyof Partial<T>];
    }
  });
  return cleanedObj;
}
