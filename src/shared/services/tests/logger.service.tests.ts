import { afterEach, describe, expect, it, vi } from "vitest";
import logger from "@/shared/services/logger.service";

describe("LoggerService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("logError", () => {
    it("writes to console.error", () => {
      // Arrange
      const spy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      // Act
      logger.logError("boom", { id: 1 });

      // Assert
      expect(spy).toHaveBeenCalledWith("boom", [{ id: 1 }]);
    });
  });

  describe("logInfo", () => {
    it("writes to console.info", () => {
      // Arrange
      const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);

      // Act
      logger.logInfo("ok");

      // Assert
      expect(spy).toHaveBeenCalledWith("ok", []);
    });
  });

  describe("logWarn", () => {
    it("writes to console.warn", () => {
      // Arrange
      const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

      // Act
      logger.logWarn("careful");

      // Assert
      expect(spy).toHaveBeenCalledWith("careful", []);
    });
  });
});
