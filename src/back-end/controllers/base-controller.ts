import "server-only";
import type { Session } from "next-auth";
import { CustomError } from "@/back-end/common/errors";
import type { ValidationResponse } from "@/back-end/controllers/types";
import authService from "@/back-end/DAL/db-services/auth.service";
import logger from "@/shared/services/logger.service";

export abstract class BaseController {
  protected async validationObjectWrapper<T = unknown>(
    action: "get" | "update" | "delete" | "create",
    callback: (session?: Session) => Promise<T>,
    options: { requireAuth?: boolean } = { requireAuth: true },
  ): Promise<ValidationResponse<T>> {
    try {
      let session: Session = null as unknown as Session;
      if (options?.requireAuth) {
        session = await authService.getAuthenticatedSession();
      }
      const response = await callback(session);

      const successMessageKeyByAction = {
        get: "i18n.Common.DataGetSuccess",
        create: "i18n.Common.DataCreateSuccess",
        update: "i18n.Common.DataUpdateSuccess",
        delete: "i18n.Common.DataDeleteSuccess",
      } as const;

      return {
        success: true,
        data: response,
        message: successMessageKeyByAction[action],
      };
    } catch (error) {
      logger.logError(`[controllers] Error when ${action} data:`, error);
      if (error instanceof CustomError) {
        if (error.isZodError) {
          return {
            success: false,
            error: "i18n.Common.ValidationError",
            zodErrors: error.zodErrors,
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: "i18n.Common.PleaseTryAgain",
      };
    }
  }
}
