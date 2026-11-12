import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";

vi.mock("@/back-end/DAL/db-services/auth.service", () => ({
  default: {
    getAuthenticatedSession: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/balance-db.service", () => ({
  default: {
    getBalance: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/recurring-db.service", () => ({
  default: {
    materializeDueBills: vi.fn(),
  },
}));

import balanceController from "@/back-end/controllers/balance-controller";
import authService from "@/back-end/DAL/db-services/auth.service";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import recurringDbService from "@/back-end/DAL/db-services/recurring-db.service";

describe("BalanceController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
      user: { id: "user-1" },
    } as Session);
  });

  describe("getBalance", () => {
    it("materializes due bills then returns the mapped balance", async () => {
      // Arrange
      const balance = {
        id: "bal-1",
        current: 100,
        income: 200,
        expenses: 100,
      };
      vi.mocked(recurringDbService.materializeDueBills).mockResolvedValue(0);
      vi.mocked(balanceDbService.getBalance).mockResolvedValue(balance);

      // Act
      const result = await balanceController.getBalance();

      // Assert
      expect(recurringDbService.materializeDueBills).toHaveBeenCalledWith(
        "user-1",
      );
      expect(balanceDbService.getBalance).toHaveBeenCalledWith("user-1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(balance);
    });
  });
});
