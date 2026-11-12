import type { Balance } from "@prisma/client";
import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import balanceMapper from "@/back-end/mappers/balance-mapper";

describe("BalanceMapper", () => {
  describe("mapBalanceToOutput", () => {
    it("maps balance fields to the DTO shape", () => {
      // Arrange
      const balance = {
        id: "bal-1",
        current: 1000,
        income: 1500,
        expenses: 500,
      } as Balance;

      // Act
      const result = balanceMapper.mapBalanceToOutput(balance);

      // Assert
      expect(result).toEqual({
        id: "bal-1",
        current: 1000,
        income: 1500,
        expenses: 500,
      });
    });
  });
});
