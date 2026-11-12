import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/shared/lib/test-utils/logger.service.mock";
import translationService from "@/shared/services/translation.service";

describe("TranslationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isValidLocale", () => {
    it("accepts en-US", () => {
      // Arrange & Act
      const result = translationService.isValidLocale("en-US");

      // Assert
      expect(result).toBe(true);
    });

    it("rejects an unknown locale", () => {
      // Arrange & Act
      const result = translationService.isValidLocale("fr-FR");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("joinKeyWithParams", () => {
    it("joins a key with JSON params", () => {
      // Arrange & Act
      const result = translationService.joinKeyWithParams(
        "i18n.Validation.ExceedsTarget",
        { target: 100 },
      );

      // Assert
      expect(result).toBe(
        'i18n.Validation.ExceedsTarget::{"target":100}',
      );
    });

    it("throws when params are empty", () => {
      // Arrange & Act & Assert
      expect(() =>
        translationService.joinKeyWithParams("i18n.Validation.ExceedsTarget", {}),
      ).toThrow(/non-empty params/);
    });
  });

  describe("translate", () => {
    it("passes plain text through unchanged", () => {
      // Arrange
      const t = (key: string) => `t:${key}`;

      // Act
      const result = translationService.translate(t, "Already saved");

      // Assert
      expect(result).toBe("Already saved");
    });

    it("translates an i18n key through the translator", () => {
      // Arrange
      const t = (key: string) => `t:${key}`;

      // Act
      const result = translationService.translate(t, "i18n.Common.Ok");

      // Assert
      expect(result).toBe("t:i18n.Common.Ok");
    });

    it("uses the fallback key when input is empty", () => {
      // Arrange
      const t = (key: string) => `t:${key}`;

      // Act
      const result = translationService.translate(
        t,
        "",
        "i18n.Common.UnknownError",
      );

      // Assert
      expect(result).toBe("t:i18n.Common.UnknownError");
    });

    it("translates a record of field messages", () => {
      // Arrange
      const t = (key: string, values?: Record<string, string | number>) =>
        values ? `${key}:${JSON.stringify(values)}` : key;

      // Act
      const result = translationService.translate(t, {
        name: "i18n.Validation.Required",
        amount: 'i18n.Validation.Min::{"min":1}',
      });

      // Assert
      expect(result).toEqual({
        name: "i18n.Validation.Required",
        amount: 'i18n.Validation.Min:{"min":1}',
      });
    });

    it("returns the key as-is when no translator is provided", () => {
      // Arrange & Act
      const result = translationService.translate(
        undefined,
        "i18n.Common.Error",
      );

      // Assert
      expect(result).toBe("i18n.Common.Error");
    });
  });

  describe("translateToDefaultLocale", () => {
    it("resolves a known default-locale key", () => {
      // Arrange & Act
      const result = translationService.translateToDefaultLocale(
        "i18n.Validation.InvalidEmail",
      );

      // Assert
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toBe("i18n.Validation.InvalidEmail");
    });
  });

  describe("getMessages", () => {
    it("returns default messages for an invalid locale", async () => {
      // Arrange & Act
      const result = await translationService.getMessages("nope");

      // Assert
      expect(result).toBe(translationService.DefaultMessages);
    });
  });
});
