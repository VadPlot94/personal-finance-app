import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import bcrypt from "bcryptjs";
import cryptoService from "@/back-end/DAL/db-services/crypto.service";

describe("CryptoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("hashes with bcrypt cost factor 12", async () => {
      // Arrange
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

      // Act
      const result = await cryptoService.hashPassword("secret");

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith("secret", 12);
      expect(result).toBe("hashed");
    });
  });

  describe("verifyPassword", () => {
    it("compares the password to the stored hash", async () => {
      // Arrange
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      // Act
      const result = await cryptoService.verifyPassword("secret", "hashed");

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith("secret", "hashed");
      expect(result).toBe(true);
    });
  });
});
