import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";
import { BaseController } from "@/back-end/controllers/base-controller";

vi.mock("@/back-end/DAL/db-services/auth.service", () => ({
  default: {
    getAuthenticatedSession: vi.fn(),
  },
}));

import authService from "@/back-end/DAL/db-services/auth.service";

class TestController extends BaseController {
  public run<T>(
    action: "get" | "update" | "delete" | "create",
    callback: (session?: Session) => Promise<T>,
    options?: { requireAuth?: boolean },
  ) {
    return this.validationObjectWrapper(action, callback, options);
  }
}

describe("BaseController", () => {
  const controller = new TestController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validationObjectWrapper", () => {
    it("returns success with the action message key", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
        user: { id: "user-1" },
      } as Session);

      // Act
      const result = await controller.run("get", async () => ({ ok: true }));

      // Assert
      expect(result).toEqual({
        success: true,
        data: { ok: true },
        message: "i18n.Common.DataGetSuccess",
      });
    });

    it("skips auth when requireAuth is false", async () => {
      // Arrange & Act
      const result = await controller.run("create", async () => "created", {
        requireAuth: false,
      });

      // Assert
      expect(authService.getAuthenticatedSession).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe("i18n.Common.DataCreateSuccess");
    });

    it("maps CustomError zod failures to zodErrors", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
        user: { id: "user-1" },
      } as Session);

      // Act
      const result = await controller.run("update", async () => {
        throw new CustomError("Validation error", {
          amount: "i18n.Validation.InvalidCash",
        });
      });

      // Assert
      expect(result).toEqual({
        success: false,
        error: "i18n.Common.ValidationError",
        zodErrors: { amount: "i18n.Validation.InvalidCash" },
      });
    });

    it("maps CustomError non-zod failures to the error message", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
        user: { id: "user-1" },
      } as Session);

      // Act
      const result = await controller.run("delete", async () => {
        throw new CustomError("Unauthorized");
      });

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Unauthorized",
      });
    });

    it("maps unexpected errors to a generic retry message", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
        user: { id: "user-1" },
      } as Session);

      // Act
      const result = await controller.run("get", async () => {
        throw new Error("boom");
      });

      // Assert
      expect(result).toEqual({
        success: false,
        error: "i18n.Common.PleaseTryAgain",
      });
    });
  });
});
