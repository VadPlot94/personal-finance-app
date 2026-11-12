import type { Pot } from "@prisma/client";
import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import potMapper from "@/back-end/mappers/pot-mapper";
import { Theme } from "@/shared/services/constants.service";

describe("PotMapper", () => {
  describe("mapCreatePotInputToDBPot", () => {
    it("maps form fields and strips spaces from target", () => {
      // Arrange
      const formData = new FormData();
      formData.set("id", "pot-1");
      formData.set("userId", "user-1");
      formData.set("potName", "Vacation");
      formData.set("target", "2 000");
      formData.set("theme", Theme.Cyan);
      formData.set("total", "150");

      // Act
      const result = potMapper.mapCreatePotInputToDBPot(formData);

      // Assert
      expect(result).toEqual({
        id: "pot-1",
        userId: "user-1",
        name: "Vacation",
        target: 2000,
        theme: Theme.Cyan,
        total: 150,
      });
    });

    it("defaults theme to NavyGrey when missing", () => {
      // Arrange
      const formData = new FormData();
      formData.set("potName", "Rainy Day");
      formData.set("target", "100");

      // Act
      const result = potMapper.mapCreatePotInputToDBPot(formData);

      // Assert
      expect(result?.theme).toBe(Theme.NavyGrey);
      expect(result?.total).toBe(0);
    });
  });

  describe("mapCreateDBPotToOutput", () => {
    it("returns the created pot id", () => {
      // Arrange & Act
      const result = potMapper.mapCreateDBPotToOutput({ id: "pot-1" });

      // Assert
      expect(result).toEqual({ id: "pot-1" });
    });
  });

  describe("mapEditPotInputToDBPot", () => {
    it("reuses create mapping for edit input", () => {
      // Arrange
      const formData = new FormData();
      formData.set("potName", "Rainy Day");
      formData.set("target", "80");

      // Act
      const result = potMapper.mapEditPotInputToDBPot(formData);

      // Assert
      expect(result?.name).toBe("Rainy Day");
      expect(result?.target).toBe(80);
    });
  });

  describe("mapEditDBPotToOutput", () => {
    it("returns the edited pot id", () => {
      // Arrange & Act
      const result = potMapper.mapEditDBPotToOutput({ id: "pot-2" });

      // Assert
      expect(result).toEqual({ id: "pot-2" });
    });
  });

  describe("mapSetPotTotalInputToDBPot", () => {
    it("returns id and total", () => {
      // Arrange & Act
      const result = potMapper.mapSetPotTotalInputToDBPot("pot-1", 75);

      // Assert
      expect(result).toEqual({ id: "pot-1", total: 75 });
    });
  });

  describe("mapGetAllPotsToOutput", () => {
    it("returns pots unchanged", () => {
      // Arrange
      const pots = [{ id: "pot-1" } as Pot];

      // Act
      const result = potMapper.mapGetAllPotsToOutput(pots);

      // Assert
      expect(result).toBe(pots);
    });
  });
});
