import "server-only";

import type { Pot } from "@prisma/client";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag, potsTag } from "@/back-end/DAL/cache/cache-tags";
import potDbService from "@/back-end/DAL/db-services/pot-db.service";
import type {
  ICreatePotDTOInput,
  ICreatePotDTOOutput,
  IEditPotDTOInput,
  IEditPotDTOOutput,
} from "@/back-end/dto-model-types/pot-dto-model.type";

async function getAllPotsCached(userId: string): Promise<Pot[]> {
  "use cache";
  cacheTag(potsTag(userId));
  cacheLife("minutes");
  return potDbService.getAllPots(userId);
}

class PotController extends BaseController {
  public async getAllPots(): Promise<ValidationResponse<Pot[]>> {
    return await this.validationObjectWrapper<Pot[]>(
      "get",
      async (session?: Session) => {
        return getAllPotsCached(session?.user?.id!);
      },
    );
  }

  public async createPot(
    _prevState: { success: boolean } | null,
    formData: ICreatePotDTOInput,
  ): Promise<ValidationResponse<ICreatePotDTOOutput>> {
    return await this.validationObjectWrapper<ICreatePotDTOOutput>(
      "create",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await potDbService.createPot(formData, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  public async editPot(
    _prevState: { success: boolean } | null,
    formData: IEditPotDTOInput,
  ): Promise<ValidationResponse<IEditPotDTOOutput>> {
    return await this.validationObjectWrapper<IEditPotDTOOutput>(
      "update",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await potDbService.editPot(formData, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  public async deletePot(id: string): Promise<ValidationResponse> {
    return await this.validationObjectWrapper<boolean>(
      "delete",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await potDbService.deletePot(id, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  public async setPotTotal(
    id: string,
    newTotal: number,
  ): Promise<ValidationResponse<IEditPotDTOOutput>> {
    return await this.validationObjectWrapper<IEditPotDTOOutput>(
      "update",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await potDbService.setPotTotal(id, newTotal, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  private syncChanges(userId: string) {
    updateTag(potsTag(userId));
    updateTag(balanceTag(userId));
  }
}

const potController = new PotController();
export default potController;
