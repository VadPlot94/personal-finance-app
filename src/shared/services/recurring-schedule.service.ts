import type { IYearMonth } from "@/shared/services/types";

class RecurringScheduleService {
  public getDueDateInMonth(
    year: number,
    month: number,
    dayOfMonth: number,
  ): Date {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(Math.max(1, dayOfMonth || 1), daysInMonth);
    return new Date(year, month, safeDay);
  }

  public shouldPostDueBill(
    today: Date,
    dueDate: Date,
    alreadyPostedThisMonth: boolean,
  ): boolean {
    if (alreadyPostedThisMonth) {
      return false;
    }
    return this.startOfLocalDay(today) >= this.startOfLocalDay(dueDate);
  }

  public collectYearMonthKeys(dates: Date[]): string[] {
    const keys = new Set<string>();
    dates.forEach((date) => {
      keys.add(this.getYearMonthKey(date.getFullYear(), date.getMonth()));
    });
    return [...keys];
  }

  public getSummaryYearMonth(
    latestDate: Date,
    monthsWithData: Iterable<string>,
  ): IYearMonth | null {
    const months = new Set(monthsWithData);
    const candidates = Array.from({ length: 120 }, (_, index) => {
      const candidate = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth() - 1 - index,
        1,
      );
      return {
        year: candidate.getFullYear(),
        month: candidate.getMonth(),
      };
    });
    return (
      candidates.find((yearMonth) =>
        months.has(this.getYearMonthKey(yearMonth.year, yearMonth.month)),
      ) ?? null
    );
  }

  private getYearMonthKey(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  private startOfLocalDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

const recurringScheduleService = new RecurringScheduleService();
export default recurringScheduleService;
