import { describe, expect, it } from "vitest";
import recurringScheduleService from "@/shared/services/recurring-schedule.service";

describe("RecurringScheduleService", () => {
  describe("getDueDateInMonth", () => {
    it("keeps the bill day when the month has that many days", () => {
      // Arrange & Act
      const result = recurringScheduleService.getDueDateInMonth(2024, 7, 11);

      // Assert
      expect(result.getDate()).toBe(11);
    });

    it("clamps to the last day of a shorter month", () => {
      // Arrange & Act
      const result = recurringScheduleService.getDueDateInMonth(2025, 1, 31);

      // Assert
      expect(result.getDate()).toBe(28);
    });

    it("clamps to 29 in a leap-year February", () => {
      // Arrange & Act
      const result = recurringScheduleService.getDueDateInMonth(2024, 1, 31);

      // Assert
      expect(result.getDate()).toBe(29);
    });
  });

  describe("shouldPostDueBill", () => {
    it("returns false when the bill is already posted this month", () => {
      // Arrange
      const today = new Date(2026, 9, 22);
      const dueDate = new Date(2026, 9, 12);

      // Act
      const result = recurringScheduleService.shouldPostDueBill(
        today,
        dueDate,
        true,
      );

      // Assert
      expect(result).toBe(false);
    });

    it("returns false when today is before the due date", () => {
      // Arrange
      const today = new Date(2026, 9, 5);
      const dueDate = new Date(2026, 9, 12);

      // Act
      const result = recurringScheduleService.shouldPostDueBill(
        today,
        dueDate,
        false,
      );

      // Assert
      expect(result).toBe(false);
    });

    it("returns true when today is the due date", () => {
      // Arrange
      const today = new Date(2026, 9, 12, 8, 15);
      const dueDate = new Date(2026, 9, 12);

      // Act
      const result = recurringScheduleService.shouldPostDueBill(
        today,
        dueDate,
        false,
      );

      // Assert
      expect(result).toBe(true);
    });

    it("returns true when today is after the due date", () => {
      // Arrange
      const today = new Date(2026, 9, 22);
      const dueDate = new Date(2026, 9, 12);

      // Act
      const result = recurringScheduleService.shouldPostDueBill(
        today,
        dueDate,
        false,
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("collectYearMonthKeys", () => {
    it("returns unique year-month keys", () => {
      // Arrange
      const dates = [
        new Date(2024, 6, 2),
        new Date(2024, 7, 11),
        new Date(2024, 6, 19),
      ];

      // Act
      const result = recurringScheduleService.collectYearMonthKeys(dates);

      // Assert
      expect(result).toEqual(["2024-07", "2024-08"]);
    });
  });

  describe("getSummaryYearMonth", () => {
    it("skips the latest month and uses July 2024 for the seed", () => {
      // Arrange
      const latestDate = new Date(2024, 7, 11);
      const monthsWithData = ["2024-07", "2024-08"];

      // Act
      const result = recurringScheduleService.getSummaryYearMonth(
        latestDate,
        monthsWithData,
      );

      // Assert
      expect(result).toEqual({ year: 2024, month: 6 });
    });

    it("walks back from a newer posted month to the nearest month with data", () => {
      // Arrange
      const latestDate = new Date(2026, 9, 22);
      const monthsWithData = ["2024-07", "2024-08", "2026-10"];

      // Act
      const result = recurringScheduleService.getSummaryYearMonth(
        latestDate,
        monthsWithData,
      );

      // Assert
      expect(result).toEqual({ year: 2024, month: 7 });
    });

    it("returns null when no previous month has data", () => {
      // Arrange
      const latestDate = new Date(2024, 7, 11);
      const monthsWithData = ["2024-08"];

      // Act
      const result = recurringScheduleService.getSummaryYearMonth(
        latestDate,
        monthsWithData,
      );

      // Assert
      expect(result).toBeNull();
    });
  });
});
