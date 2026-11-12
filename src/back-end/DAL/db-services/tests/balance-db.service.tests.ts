import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    transaction: {
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("@/back-end/DAL/repositories/balance.repository", () => ({
  balanceRepository: {
    upsertBalance: vi.fn(),
  },
}));

vi.mock("@/back-end/mappers/balance-mapper", () => ({
  default: {
    mapBalanceToOutput: vi.fn(),
  },
}));

vi.mock("@/shared/services/balance.service", () => ({
  default: {
    computeFromSums: vi.fn(),
  },
}));

import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import balanceMapper from "@/back-end/mappers/balance-mapper";
import prisma from "@/back-end/prisma/prisma-client";
import balanceService from "@/shared/services/balance.service";

describe("BalanceDbService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("recalculateBalance", () => {
    it("aggregates income and expenses then upserts computed totals", async () => {
      // Arrange
      vi.mocked(prisma.transaction.aggregate)
        .mockResolvedValueOnce({ _sum: { amount: 200 } } as never)
        .mockResolvedValueOnce({ _sum: { amount: -50 } } as never);
      vi.mocked(balanceService.computeFromSums).mockReturnValue({
        current: 150,
        income: 200,
        expenses: 50,
      });
      const upserted = {
        id: "bal-1",
        current: 150,
        income: 200,
        expenses: 50,
      };
      vi.mocked(balanceRepository.upsertBalance).mockResolvedValue(
        upserted as never,
      );

      // Act
      const result = await balanceDbService.recalculateBalance("user-1");

      // Assert
      expect(balanceService.computeFromSums).toHaveBeenCalledWith(200, 50);
      expect(balanceRepository.upsertBalance).toHaveBeenCalledWith({
        userId: "user-1",
        current: 150,
        income: 200,
        expenses: 50,
      });
      expect(result).toEqual(upserted);
    });
  });

  describe("getBalance", () => {
    it("recalculates then maps the balance to output", async () => {
      // Arrange
      vi.mocked(prisma.transaction.aggregate)
        .mockResolvedValueOnce({ _sum: { amount: 100 } } as never)
        .mockResolvedValueOnce({ _sum: { amount: 0 } } as never);
      vi.mocked(balanceService.computeFromSums).mockReturnValue({
        current: 100,
        income: 100,
        expenses: 0,
      });
      const upserted = {
        id: "bal-1",
        current: 100,
        income: 100,
        expenses: 0,
      };
      vi.mocked(balanceRepository.upsertBalance).mockResolvedValue(
        upserted as never,
      );
      vi.mocked(balanceMapper.mapBalanceToOutput).mockReturnValue({
        id: "bal-1",
        current: 100,
        income: 100,
        expenses: 0,
      });

      // Act
      const result = await balanceDbService.getBalance("user-1");

      // Assert
      expect(balanceMapper.mapBalanceToOutput).toHaveBeenCalledWith(upserted);
      expect(result).toEqual({
        id: "bal-1",
        current: 100,
        income: 100,
        expenses: 0,
      });
    });
  });
});
