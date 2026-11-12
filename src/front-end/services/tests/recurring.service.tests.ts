import type { Transaction } from "@prisma/client";
import { describe, expect, it } from "vitest";
import recurringService, {
  RecurringStatus,
} from "@/front-end/services/recurring.service";

function createRecurringExpense(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    id: "tx-1",
    userId: "user-1",
    amount: -100,
    avatar: "",
    category: "Bills",
    date: new Date(2026, 0, 10),
    name: "Netflix",
    recurring: true,
    ...overrides,
  } as Transaction;
}

describe("RecurringService", () => {
  describe("getRecurringDueDateString", () => {
    it("uses st suffix for day 1 in English", () => {
      // Arrange
      const date = new Date(2026, 0, 1);
      const formatDueDate = (parts: {
        monthName: string;
        day: number;
        suffix: string;
      }) => `${parts.monthName} ${parts.day}${parts.suffix}`;

      // Act
      const result = recurringService.getRecurringDueDateString(
        date,
        "en-US",
        formatDueDate,
      );

      // Assert
      expect(result).toBe("January 1st");
    });

    it("uses nd suffix for day 22 in English", () => {
      // Arrange
      const date = new Date(2026, 0, 22);
      const formatDueDate = (parts: {
        monthName: string;
        day: number;
        suffix: string;
      }) => `${parts.day}${parts.suffix}`;

      // Act
      const result = recurringService.getRecurringDueDateString(
        date,
        "en-US",
        formatDueDate,
      );

      // Assert
      expect(result).toBe("22nd");
    });

    it("clears the ordinal suffix for Russian locales", () => {
      // Arrange
      const date = new Date(2026, 0, 1);
      const formatDueDate = (parts: {
        monthName: string;
        day: number;
        suffix: string;
      }) => `${parts.day}${parts.suffix}`;

      // Act
      const result = recurringService.getRecurringDueDateString(
        date,
        "ru-RU",
        formatDueDate,
      );

      // Assert
      expect(result).toBe("1");
    });
  });

  describe("getTransactionStatus", () => {
    it("returns Upcoming when referenceDate is missing", () => {
      // Arrange
      const transaction = createRecurringExpense();

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        null,
      );

      // Assert
      expect(result).toBe(RecurringStatus.Upcoming);
    });

    it("returns Upcoming for non-recurring transactions", () => {
      // Arrange
      const transaction = createRecurringExpense({ recurring: false });
      const referenceDate = new Date(2026, 0, 15);

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        referenceDate,
      );

      // Assert
      expect(result).toBe(RecurringStatus.Upcoming);
    });

    it("returns Upcoming for income amounts", () => {
      // Arrange
      const transaction = createRecurringExpense({ amount: 50 });
      const referenceDate = new Date(2026, 0, 15);

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        referenceDate,
      );

      // Assert
      expect(result).toBe(RecurringStatus.Upcoming);
    });

    it("returns Paid when bill date is on or before reference date", () => {
      // Arrange
      const transaction = createRecurringExpense({
        date: new Date(2026, 0, 10),
      });
      const referenceDate = new Date(2026, 0, 10);

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        referenceDate,
      );

      // Assert
      expect(result).toBe(RecurringStatus.Paid);
    });

    it("returns DueSoon when bill is within dueSoonDays", () => {
      // Arrange
      const transaction = createRecurringExpense({
        date: new Date(2026, 0, 15),
      });
      const referenceDate = new Date(2026, 0, 10);

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        referenceDate,
        7,
      );

      // Assert
      expect(result).toBe(RecurringStatus.DueSoon);
    });

    it("returns Upcoming when bill is beyond dueSoonDays", () => {
      // Arrange
      const transaction = createRecurringExpense({
        date: new Date(2026, 0, 25),
      });
      const referenceDate = new Date(2026, 0, 10);

      // Act
      const result = recurringService.getTransactionStatus(
        transaction,
        referenceDate,
        7,
      );

      // Assert
      expect(result).toBe(RecurringStatus.Upcoming);
    });
  });

  describe("computeRecurringStats", () => {
    it("returns empty stats when now is null", () => {
      // Arrange
      const transactions = [createRecurringExpense()];

      // Act
      const result = recurringService.computeRecurringStats(
        transactions,
        null,
      );

      // Assert
      expect(result.referenceDate).toBeNull();
      expect(result.stats.totalBills).toBe("0.00");
    });

    it("returns empty stats when transactions are empty", () => {
      // Arrange
      const now = new Date(2026, 0, 12);

      // Act
      const result = recurringService.computeRecurringStats([], now);

      // Assert
      expect(result.referenceDate).toBeNull();
      expect(result.stats.paidCount).toBe(0);
    });

    it("aggregates paid, upcoming, and due soon for the forecast month", () => {
      // Arrange
      // Latest month is February; summary month with prior data is January.
      const transactions = [
        createRecurringExpense({
          id: "jan-paid",
          date: new Date(2026, 0, 5),
          amount: -40,
        }),
        createRecurringExpense({
          id: "jan-due-soon",
          date: new Date(2026, 0, 16),
          amount: -30,
        }),
        createRecurringExpense({
          id: "jan-upcoming",
          date: new Date(2026, 0, 28),
          amount: -20,
        }),
        createRecurringExpense({
          id: "feb-latest",
          date: new Date(2026, 1, 20),
          amount: -10,
        }),
      ];
      const now = new Date(2026, 0, 12, 9, 0, 0);

      // Act
      const result = recurringService.computeRecurringStats(
        transactions,
        now,
        7,
        "en-US",
      );

      // Assert
      expect(result.referenceDate).toEqual(new Date(2026, 0, 12, 9, 0, 0));
      expect(result.stats.paidCount).toBe(1);
      expect(result.stats.paidAmount).toBe("40.00");
      expect(result.stats.upcomingCount).toBe(2);
      expect(result.stats.upcomingAmount).toBe("50.00");
      expect(result.stats.dueSoonCount).toBe(1);
      expect(result.stats.dueSoonAmount).toBe("30.00");
      expect(result.stats.totalBills).toBe("90.00");
      expect(result.stats.referenceMonthName).toMatch(/January/);
    });
  });

  describe("formatReferenceDateLabel", () => {
    it("returns an em dash when referenceDate is null", () => {
      // Arrange & Act
      const result = recurringService.formatReferenceDateLabel(null);

      // Assert
      expect(result).toBe("—");
    });

    it("formats a reference date for the given locale", () => {
      // Arrange
      const referenceDate = new Date(2026, 0, 12, 9, 0, 0);

      // Act
      const result = recurringService.formatReferenceDateLabel(
        referenceDate,
        "en-US",
      );

      // Assert
      expect(result).toContain("January");
      expect(result).toContain("12");
    });
  });
});
