import "server-only";
import type { Pot } from "@prisma/client";
import type {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "@/back-end/dto-model-types/pot-dto-model.type";
import { removeUndefinedFields } from "@/lib/utils";
import { Theme } from "@/shared/services/constants.service";

class PotMapper {
  public mapCreatePotInputToDBPot(
    input: ICreatePotDTOInput,
  ): Partial<Pot> | null {
    return this.getPotModel(input);
  }

  public mapCreateDBPotToOutput(
    dbPOutput: ICreatePotDTOOutput,
  ): ICreatePotDTOOutput {
    return { id: dbPOutput?.id };
  }

  public mapEditPotInputToDBPot(input: IEditPotDTOInput): Partial<Pot> | null {
    return this.mapCreatePotInputToDBPot(input as ICreatePotDTOInput);
  }

  public mapEditDBPotToOutput(dbPOutput: IEditPotDTOOutput): IEditPotDTOOutput {
    return this.mapCreateDBPotToOutput(dbPOutput as ICreatePotDTOOutput);
  }

  public mapSetPotTotalInputToDBPot(
    id: string,
    newTotal: number,
  ): Pick<Pot, "id" | "total"> {
    return { id, total: newTotal };
  }

  public mapGetAllPotsToOutput(pots: Pot[]): Pot[] {
    return pots;
  }

  private getPotModel(formData: FormData): Partial<Pot> | null {
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
}

const potMapper = new PotMapper();
export default potMapper;
