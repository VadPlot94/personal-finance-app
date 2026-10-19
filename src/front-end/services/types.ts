export interface IRecurringFormattedStats {
  referenceMonthName: string;
  totalBills: string;
  paidCount: number;
  paidAmount: string;
  upcomingCount: number;
  upcomingAmount: string;
  dueSoonCount: number;
  dueSoonAmount: string;
}

export interface IRecurringStatsResult {
  stats: IRecurringFormattedStats;
  referenceDate: Date | null;
}

export interface IRecurringDueDateParts {
  monthName: string;
  day: number;
  suffix: string;
}
