import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";
import { Theme } from "@/shared/services/constants.service";

vi.mock("@/back-end/DAL/repositories/pot.repository", () => ({
  potRepository: {
    getAll: vi.fn(),
    createPot: vi.fn(),
    updateOwned: vi.fn(),
    deleteOwned: vi.fn(),
    isUnique: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/repositories/balance.repository", () => ({
  balanceRepository: {
    getCurrent: vi.fn(),
  },
}));

vi.mock("@/back-end/mappers/pot-mapper", () => ({
  default: {
    mapGetAllPotsToOutput: vi.fn(),
    mapCreatePotInputToDBPot: vi.fn(),
    mapEditPotInputToDBPot: vi.fn(),
    mapCreateDBPotToOutput: vi.fn(),
    mapEditDBPotToOutput: vi.fn(),
    mapSetPotTotalInputToDBPot: vi.fn(),
  },
}));

vi.mock("@/shared/services/validation.service", () => ({
  default: {
    createCustomZodIssueResult: vi.fn(),
    createErrorsWithPath: vi.fn(() => ({ field: "required" })),
    validateCreatePotSchemaServer: vi.fn(),
    validateTotal: vi.fn(),
  },
}));

vi.mock("@/shared/services/pot.service", () => ({
  default: {
    getAllSavedPotsMoney: vi.fn(),
  },
}));

vi.mock("@/shared/services/balance.service", () => ({
  default: {
    computeAvailable: vi.fn(),
  },
}));

import potDbService from "@/back-end/DAL/db-services/pot-db.service";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import potMapper from "@/back-end/mappers/pot-mapper";
import balanceService from "@/shared/services/balance.service";
import potService from "@/shared/services/pot.service";
import validationService from "@/shared/services/validation.service";

describe("PotDbService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllPots", () => {
    it("maps repository pots to output", async () => {
      // Arrange
      const pots = [{ id: "pot-1" }];
      vi.mocked(potRepository.getAll).mockResolvedValue(pots as never);
      vi.mocked(potMapper.mapGetAllPotsToOutput).mockReturnValue(pots as never);

      // Act
      const result = await potDbService.getAllPots("user-1");

      // Assert
      expect(result).toEqual(pots);
    });
  });

  describe("createPot", () => {
    it("validates uniqueness and creates a pot", async () => {
      // Arrange
      const formData = new FormData();
      const potModel = {
        name: "Vacation",
        target: 500,
        theme: Theme.Green,
        total: 0,
      };
      vi.mocked(potMapper.mapCreatePotInputToDBPot).mockReturnValue(potModel);
      vi.mocked(potRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateCreatePotSchemaServer).mockReturnValue(
        { success: true, data: {} } as never,
      );
      vi.mocked(potRepository.createPot).mockResolvedValue({ id: "pot-1" });
      vi.mocked(potMapper.mapCreateDBPotToOutput).mockReturnValue({
        id: "pot-1",
      });

      // Act
      const result = await potDbService.createPot(formData, "user-1");

      // Assert
      expect(result).toEqual({ id: "pot-1" });
    });

    it("throws when pot name is missing", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapCreatePotInputToDBPot).mockReturnValue({
        target: 100,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["potName"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        potDbService.createPot(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when target is missing", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapCreatePotInputToDBPot).mockReturnValue({
        name: "Vacation",
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["target"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        potDbService.createPot(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when pot name is not unique", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapCreatePotInputToDBPot).mockReturnValue({
        name: "Vacation",
        target: 100,
      });
      vi.mocked(potRepository.isUnique).mockResolvedValue(false);
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["potName"], message: "exists" }] },
      } as never);

      // Act & Assert
      await expect(
        potDbService.createPot(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("editPot", () => {
    it("throws when id is missing for update", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapEditPotInputToDBPot).mockReturnValue({
        name: "Vacation",
        target: 100,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["id"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        potDbService.editPot(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("updates an owned pot", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapEditPotInputToDBPot).mockReturnValue({
        id: "pot-1",
        name: "Vacation",
        target: 100,
        theme: Theme.Green,
      });
      vi.mocked(potRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateCreatePotSchemaServer).mockReturnValue(
        { success: true, data: {} } as never,
      );
      vi.mocked(potRepository.updateOwned).mockResolvedValue({ id: "pot-1" });
      vi.mocked(potMapper.mapEditDBPotToOutput).mockReturnValue({
        id: "pot-1",
      });

      // Act
      const result = await potDbService.editPot(formData, "user-1");

      // Assert
      expect(result).toEqual({ id: "pot-1" });
    });

    it("throws when updateOwned returns null", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potMapper.mapEditPotInputToDBPot).mockReturnValue({
        id: "pot-1",
        name: "Vacation",
        target: 100,
        theme: Theme.Green,
      });
      vi.mocked(potRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateCreatePotSchemaServer).mockReturnValue(
        { success: true, data: {} } as never,
      );
      vi.mocked(potRepository.updateOwned).mockResolvedValue(null);

      // Act & Assert
      await expect(
        potDbService.editPot(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("deletePot", () => {
    it("throws when id is empty", async () => {
      // Arrange & Act & Assert
      await expect(potDbService.deletePot("", "user-1")).rejects.toBeInstanceOf(
        CustomError,
      );
    });

    it("throws when delete affects no rows", async () => {
      // Arrange
      vi.mocked(potRepository.deleteOwned).mockResolvedValue(0);

      // Act & Assert
      await expect(
        potDbService.deletePot("pot-1", "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("returns true when an owned pot is deleted", async () => {
      // Arrange
      vi.mocked(potRepository.deleteOwned).mockResolvedValue(1);

      // Act
      const result = await potDbService.deletePot("pot-1", "user-1");

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("setPotTotal", () => {
    it("rejects a non-positive total", async () => {
      // Arrange
      vi.mocked(potMapper.mapSetPotTotalInputToDBPot).mockReturnValue({
        id: "pot-1",
        total: 0,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["total"], message: "positive" }] },
      } as never);

      // Act & Assert
      await expect(
        potDbService.setPotTotal("pot-1", 0, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when the pot does not exist", async () => {
      // Arrange
      vi.mocked(potMapper.mapSetPotTotalInputToDBPot).mockReturnValue({
        id: "missing",
        total: 40,
      });
      vi.mocked(potRepository.getAll).mockResolvedValue([]);

      // Act & Assert
      await expect(
        potDbService.setPotTotal("missing", 40, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("validates a withdraw against the previous total as target", async () => {
      // Arrange
      const pot = { id: "pot-1", target: 100, total: 40 };
      vi.mocked(potMapper.mapSetPotTotalInputToDBPot).mockReturnValue({
        id: "pot-1",
        total: 10,
      });
      vi.mocked(potRepository.getAll).mockResolvedValue([pot] as never);
      vi.mocked(balanceRepository.getCurrent).mockResolvedValue({
        current: 500,
      } as never);
      vi.mocked(potService.getAllSavedPotsMoney).mockReturnValue(40);
      vi.mocked(balanceService.computeAvailable).mockReturnValue(460);
      vi.mocked(validationService.validateTotal).mockReturnValue({
        success: true,
        data: "30",
      } as never);
      vi.mocked(potRepository.updateOwned).mockResolvedValue({ id: "pot-1" });
      vi.mocked(potMapper.mapEditDBPotToOutput).mockReturnValue({
        id: "pot-1",
      });

      // Act
      await potDbService.setPotTotal("pot-1", 10, "user-1");

      // Assert
      expect(validationService.validateTotal).toHaveBeenCalledWith(
        "30",
        40,
        0,
        460,
      );
    });

    it("updates total when validation passes", async () => {
      // Arrange
      const pot = {
        id: "pot-1",
        target: 100,
        total: 20,
      };
      vi.mocked(potMapper.mapSetPotTotalInputToDBPot).mockReturnValue({
        id: "pot-1",
        total: 40,
      });
      vi.mocked(potRepository.getAll).mockResolvedValue([pot] as never);
      vi.mocked(balanceRepository.getCurrent).mockResolvedValue({
        current: 500,
      } as never);
      vi.mocked(potService.getAllSavedPotsMoney).mockReturnValue(20);
      vi.mocked(balanceService.computeAvailable).mockReturnValue(480);
      vi.mocked(validationService.validateTotal).mockReturnValue({
        success: true,
        data: "20",
      } as never);
      vi.mocked(potRepository.updateOwned).mockResolvedValue({ id: "pot-1" });
      vi.mocked(potMapper.mapEditDBPotToOutput).mockReturnValue({
        id: "pot-1",
      });

      // Act
      const result = await potDbService.setPotTotal("pot-1", 40, "user-1");

      // Assert
      expect(validationService.validateTotal).toHaveBeenCalledWith(
        "20",
        100,
        20,
        480,
      );
      expect(result).toEqual({ id: "pot-1" });
    });

    it("throws when updateOwned returns null", async () => {
      // Arrange
      const pot = { id: "pot-1", target: 100, total: 20 };
      vi.mocked(potMapper.mapSetPotTotalInputToDBPot).mockReturnValue({
        id: "pot-1",
        total: 40,
      });
      vi.mocked(potRepository.getAll).mockResolvedValue([pot] as never);
      vi.mocked(balanceRepository.getCurrent).mockResolvedValue({
        current: 500,
      } as never);
      vi.mocked(potService.getAllSavedPotsMoney).mockReturnValue(20);
      vi.mocked(balanceService.computeAvailable).mockReturnValue(480);
      vi.mocked(validationService.validateTotal).mockReturnValue({
        success: true,
        data: "20",
      } as never);
      vi.mocked(potRepository.updateOwned).mockResolvedValue(null);

      // Act & Assert
      await expect(
        potDbService.setPotTotal("pot-1", 40, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });
});
