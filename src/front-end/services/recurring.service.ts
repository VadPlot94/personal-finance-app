import { Transaction } from "@prisma/client";

export enum RecurringStatus {
  Paid = "Paid",
  DueSoon = "DueSoon",
  Upcoming = "Upcoming",
}

/**
 * Service for handling recurring bills calculations and projections.
 */
class RecurringService {
  public getRecurringDueDateString(date: Date | string): string {
    const d = new Date(date);
    const day = d.getDate();

    // Eng suffixes: 1st, 2nd, 3rd, 4th–20th, 21st, 22nd, 23rd, 24th–30th, 31st
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    const monthName = d.toLocaleDateString("en-US", { month: "long" });

    return `Monthly-${monthName} ${day}${suffix}`;
  }
  /**
   * Finds the latest date among recurring transactions with negative amounts (expenses only).
   * @param transactions - Array of Transaction objects
   * @returns The most recent Date or null if no recurring expenses found
   */
  public findLatestRecurringDate(transactions: Transaction[]): Date | null {
    let latest: Date | null = null;
    transactions.forEach((t) => {
      if (t.recurring && t.amount < 0) {
        const d = new Date(t.date);
        if (!latest || d > latest) {
          latest = d;
        }
      }
    });
    return latest;
  }

  /**
   * Gets the year, month index and formatted name of the forecast month
   * based on the latest recurring transaction date.
   * @param latestDate - The most recent recurring transaction date
   * @returns Object with year, month (0-11) and human-readable name (e.g. "August 2024")
   */
  public getForecastMonthAndName(latestDate: Date): {
    year: number;
    month: number;
    name: string;
  } {
    let year = latestDate.getFullYear();
    let month = latestDate.getMonth();

    // TODO: !!!For test use July 2024!!!
    if (true) {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
    }

    const name = new Date(year, month, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { year, month, name };
  }

  /**
   * Projects the current real date's day and time into the target forecast month/year.
   * If the day exceeds the number of days in the target month, uses the last day.
   * @param realToday - Current real-world date/time
   * @param forecastYear - Target year for projection
   * @param forecastMonth - Target month index (0-11)
   * @returns Projected Date object in the forecast month
   */
  public createReferenceDate(
    realToday: Date,
    forecastYear: number,
    forecastMonth: number,
  ): Date {
    const referenceDay = realToday.getDate();
    const referenceHours = realToday.getHours();
    const referenceMinutes = realToday.getMinutes();
    const referenceSeconds = realToday.getSeconds();
    const referenceMs = realToday.getMilliseconds();

    const daysInMonth = new Date(forecastYear, forecastMonth + 1, 0).getDate();
    const safeDay = Math.min(referenceDay, daysInMonth);

    return new Date(
      forecastYear,
      forecastMonth,
      safeDay,
      referenceHours,
      referenceMinutes,
      referenceSeconds,
      referenceMs,
    );
  }

  /**
   * Filters recurring negative-amount transactions that fall within
   * the specified calendar month.
   * @param transactions - Array of all transactions
   * @param year - Target year
   * @param month - Target month index (0-11)
   * @returns Array of recurring expense transactions in the given month
   */
  public getRecurringBillsInMonth(
    transactions: Transaction[],
    year: number,
    month: number,
  ): Transaction[] {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return transactions.filter((t) => {
      if (!t.recurring || t.amount >= 0) return false;
      const d = new Date(t.date);
      return d >= monthStart && d <= monthEnd;
    });
  }

  /**
   * Calculates paid, upcoming, due soon counts and amounts based on bills
   * and a reference date (virtual "today" in the forecast month).
   * @param monthBills - Array of recurring bills in the forecast month
   * @param referenceDate - Virtual "today" date in the forecast month
   * @param dueSoonDays - Number of days considered "due soon" (default 7)
   * @returns Object with counts and formatted amounts
   */
  /**
   * Calculates paid, upcoming, due soon counts and raw amounts based on bills
   * and a reference date (virtual "today" in the forecast month).
   * @param monthBills - Array of recurring bills in the forecast month
   * @param referenceDate - Virtual "today" date in the forecast month
   * @param dueSoonDays - Number of days considered "due soon" (default 7)
   * @returns Object with counts and raw numeric amounts (not formatted)
   */
  public calculateStatsFromBills(
    monthBills: Transaction[],
    referenceDate: Date,
    dueSoonDays: number = 7,
  ): {
    paidCount: number;
    paidAmount: number;
    upcomingCount: number;
    upcomingAmount: number;
    dueSoonCount: number;
    dueSoonAmount: number;
  } {
    let paidCount = 0;
    let paidAmount = 0;
    let upcomingCount = 0;
    let upcomingAmount = 0;
    let dueSoonCount = 0;
    let dueSoonAmount = 0;

    monthBills.forEach((bill) => {
      const amount = Number(bill.amount);
      if (isNaN(amount)) return; // защита от некорректных данных

      const billDate = new Date(bill.date);

      if (billDate <= referenceDate) {
        paidCount++;
        paidAmount += amount;
      } else {
        upcomingCount++;
        upcomingAmount += amount;

        const daysLeft = Math.ceil(
          (billDate.getTime() - referenceDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (daysLeft > 0 && daysLeft <= dueSoonDays) {
          dueSoonCount++;
          dueSoonAmount += amount;
        }
      }
    });

    return {
      paidCount,
      paidAmount,
      upcomingCount,
      upcomingAmount,
      dueSoonCount,
      dueSoonAmount,
    };
  }

  /**
   * Determines the status of a single recurring transaction relative to a reference date.
   *
   * @param transaction - A single recurring transaction (should have recurring: true and amount < 0)
   * @param referenceDate - Virtual "today" date in the forecast month
   * @param dueSoonDays - Number of days considered "due soon" (default 7)
   * @returns One of RecurringStatus values: PAID, DUE_SOON, UPCOMING
   */
  public getTransactionStatus(
    transaction: Transaction,
    referenceDate: Date | null | undefined,
    dueSoonDays: number = 7,
  ): RecurringStatus {
    if (!referenceDate || !transaction.recurring || transaction.amount >= 0) {
      return RecurringStatus.Upcoming;
    }

    const billDate = new Date(transaction.date);

    if (billDate <= referenceDate) {
      return RecurringStatus.Paid;
    }

    const daysLeft = Math.ceil(
      (billDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft > 0 && daysLeft <= dueSoonDays) {
      return RecurringStatus.DueSoon;
    }

    return RecurringStatus.Upcoming;
  }

  // TODO: not compatible with pagination - need to think another way
  public getLatestUniqueRecurring(transactions: Transaction[]): Transaction[] {
    return Object.values(
      transactions.reduce<Record<string, Transaction>>((acc, tx) => {
        if (
          tx.recurring &&
          (!acc[tx.name] || new Date(tx.date) > new Date(acc[tx.name].date))
        ) {
          acc[tx.name] = tx;
        }
        return acc;
      }, {}),
    );
  }
}

const recurringService = new RecurringService();
export default recurringService;
