import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/back-end/lib/test-utils/next-cache.mock";
import "@/shared/lib/test-utils/logger.service.mock";

vi.mock("@/back-end/DAL/db-services/auth.service", () => ({
  default: {
    getAuthenticatedSession: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/pot-db.service", () => ({
  default: {
    getAllPots: vi.fn(),
    createPot: vi.fn(),
    editPot: vi.fn(),
    deletePot: vi.fn(),
    setPotTotal: vi.fn(),
  },
}));

import { updateTag } from "next/cache";
import potController from "@/back-end/controllers/pot-controller";
import { balanceTag, potsTag } from "@/back-end/DAL/cache/cache-tags";
import authService from "@/back-end/DAL/db-services/auth.service";
import potDbService from "@/back-end/DAL/db-services/pot-db.service";

describe("PotController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
      user: { id: "user-1" },
    } as Session);
  });

  describe("getAllPots", () => {
    it("returns pots for the authenticated user", async () => {
      // Arrange
      const pots = [{ id: "pot-1" }];
      vi.mocked(potDbService.getAllPots).mockResolvedValue(pots as never);

      // Act
      const result = await potController.getAllPots();

      // Assert
      expect(potDbService.getAllPots).toHaveBeenCalledWith("user-1");
      expect(result.data).toEqual(pots);
    });
  });

  describe("createPot", () => {
    it("creates a pot and invalidates pots and balance tags", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potDbService.createPot).mockResolvedValue({ id: "pot-1" });

      // Act
      const result = await potController.createPot(null, formData);

      // Assert
      expect(potDbService.createPot).toHaveBeenCalledWith(formData, "user-1");
      expect(updateTag).toHaveBeenCalledWith(potsTag("user-1"));
      expect(updateTag).toHaveBeenCalledWith(balanceTag("user-1"));
      expect(result.success).toBe(true);
    });
  });

  describe("editPot", () => {
    it("edits a pot and syncs cache", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(potDbService.editPot).mockResolvedValue({ id: "pot-1" });

      // Act
      const result = await potController.editPot(null, formData);

      // Assert
      expect(potDbService.editPot).toHaveBeenCalledWith(formData, "user-1");
      expect(result.success).toBe(true);
    });
  });

  describe("deletePot", () => {
    it("deletes a pot and syncs cache", async () => {
      // Arrange
      vi.mocked(potDbService.deletePot).mockResolvedValue(true);

      // Act
      const result = await potController.deletePot("pot-1");

      // Assert
      expect(potDbService.deletePot).toHaveBeenCalledWith("pot-1", "user-1");
      expect(result.data).toBe(true);
    });
  });

  describe("setPotTotal", () => {
    it("updates pot total and syncs cache", async () => {
      // Arrange
      vi.mocked(potDbService.setPotTotal).mockResolvedValue({ id: "pot-1" });

      // Act
      const result = await potController.setPotTotal("pot-1", 50);

      // Assert
      expect(potDbService.setPotTotal).toHaveBeenCalledWith(
        "pot-1",
        50,
        "user-1",
      );
      expect(result.success).toBe(true);
    });
  });
});
