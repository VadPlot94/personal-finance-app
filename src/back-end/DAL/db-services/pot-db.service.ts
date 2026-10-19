import "server-only";
import type { Pot } from "@prisma/client";
import { CustomError, throwValidationError } from "@/back-end/common/errors";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import type {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "@/back-end/dto-model-types/pot-dto-model.type";
import potMapper from "@/back-end/mappers/pot-mapper";
import potService from "@/shared/services/pot.service";
import type { ICreatePotFormData } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

class PotDbService {
  public async getAllPots(userId: string): Promise<Pot[]> {
    const pots = await potRepository.getAll(userId);
    return potMapper.mapGetAllPotsToOutput(pots);
  }

  public async createPot(
    potFormData: ICreatePotDTOInput,
    userId: string,
  ): Promise<ICreatePotDTOOutput> {
    const potModel = potMapper.mapCreatePotInputToDBPot(potFormData) as Pot;
    await this.validateCreatePotModel(potModel, userId);

    const response = await potRepository.createPot(
      {
        ...potModel,
        userId,
      },
      { id: true },
    );

    return potMapper.mapCreateDBPotToOutput(response);
  }

  public async editPot(
    potFormData: IEditPotDTOInput,
    userId: string,
  ): Promise<IEditPotDTOOutput> {
    const potModel = potMapper.mapEditPotInputToDBPot(potFormData) as Pot;
    await this.validateEditPotModel(potModel, userId);

    const response = await potRepository.updateOwned({
      where: { id: potModel.id, userId },
      data: {
        name: potModel.name,
        target: potModel.target,
        theme: potModel.theme,
      },
    });

    if (!response) {
      throw new CustomError("Failed to update pot");
    }

    return potMapper.mapEditDBPotToOutput(response);
  }

  public async deletePot(id: string, userId: string): Promise<boolean> {
    this.validateDeletePotModel(id);

    const deletedCount = await potRepository.deleteOwned({
      where: { id, userId },
    });

    if (!deletedCount) {
      throw new CustomError("Failed to delete pot");
    }

    return true;
  }

  public async setPotTotal(
    id: string,
    newTotal: number,
    userId: string,
  ): Promise<IEditPotDTOOutput> {
    const potModel = potMapper.mapSetPotTotalInputToDBPot(id, newTotal);
    await this.validatePotTotal(potModel.id, potModel.total, userId);

    const response = await potRepository.updateOwned({
      where: { id: potModel.id, userId },
      data: { total: potModel.total },
    });

    if (!response) {
      throw new CustomError("Unauthorized or pot not found");
    }

    return potMapper.mapEditDBPotToOutput(response);
  }

  private async validatePotTotal(
    id: string,
    newTotal: number,
    userId: string,
  ): Promise<boolean> {
    if (!id) {
      throw new CustomError("ID is required for update");
    }

    if (newTotal === 0 || Number.isNaN(newTotal)) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<object>(
          "total",
          "i18n.Validation.TotalMustBePositive",
        );
      throwValidationError(zodErrorResult);
    }

    const pots = await potRepository.getAll(userId);
    const currentPot = pots?.find((pot) => pot?.id === id);

    if (!currentPot) {
      throw new CustomError("There is no such Pot");
    }

    const { target, total } = currentPot;

    const isWithdraw = newTotal < total;
    const targetValidationAmount = isWithdraw ? total : target;
    const oldTotal = isWithdraw ? 0 : total;
    const balance = await balanceRepository.getCurrent(userId);
    const totalSum = potService.getAllSavedPotsMoney(pots);
    const availableBalance = (balance?.current ?? 0) - totalSum;
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

  private validateDeletePotModel(id: string) {
    if (!id) {
      throw new CustomError("ID is required for deletion");
    }
  }

  private async validateEditPotModel(
    potModel: Partial<Pot> | null,
    userId: string,
  ): Promise<never | boolean> {
    if (!potModel?.id) {
      throw new CustomError("ID is required for update");
    }

    return this.validateCreatePotModel(potModel, userId);
  }

  private async validateCreatePotModel(
    potModel: Partial<Pot> | null,
    userId: string,
  ): Promise<never | boolean> {
    if (!potModel?.name) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<object>(
          "potName" as ICreatePotFormData["potName"],
          "i18n.Validation.PotNameRequired",
        );
      throwValidationError(zodErrorResult);
    }
    if (!potModel?.target) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<object>(
          "target" as ICreatePotFormData["target"],
          "i18n.Validation.TargetRequired",
        );
      throwValidationError(zodErrorResult);
    }

    const isNameUnique = await potRepository.isUnique(
      "name",
      potModel?.name,
      userId,
      potModel?.id,
    );

    if (!isNameUnique) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<object>(
          "potName" as ICreatePotFormData["potName"],
          "i18n.Validation.PotNameExists",
        );
      throwValidationError(zodErrorResult);
    }

    const zodValidationResult = validationService.validateCreatePotSchemaServer(
      potModel as Pot,
    );

    throwValidationError(zodValidationResult);
    return true;
  }
}

const potDbService = new PotDbService();
export default potDbService;
