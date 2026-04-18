import { Transaction } from "@prisma/client";

export enum Theme {
  Green = "#277C78",
  Yellow = "#FACC15",
  Cyan = "#82C9D7",
  Navy = "#626070",
  Red = "#EF4444",
  Purple = "#826CB0",
  Turquoise = "#14B8A6",
  Brown = "#92400E",
  Magenta = "#D946EF",
  Blue = "#3B82F6",
  NavyGrey = "#475569",
  ArmyGreen = "#4B5320",
  Pink = "#EC4899",
  Gold = "#D97706",
  Orange = "#F97316",
  Beige = "#F2CDAC",
}

export enum SortBy {
  Latest = "Latest",
  Oldest = "Oldest",
  AtoZ = "A to Z",
  ZtoA = "Z to A",
  Highest = "Highest",
  Lowest = "Lowest",
}

export enum TransactionUICategory {
  AllTransactions = "All Transactions",
  Entertainment = "Entertainment",
  Bills = "Bills",
  Groceries = "Groceries",
  DiningOut = "Dining Out",
  Transportation = "Transportation",
  PersonalCare = "Personal Care",
  Education = "Education",
  Lifestyle = "Lifestyle",
  Shopping = "Shopping",
  General = "General",
}

export const sortByPrismaMap: Record<
  SortBy,
  { [key: string]: "asc" | "desc" }
> = {
  [SortBy.Latest]: { date: "desc" },
  [SortBy.Oldest]: { date: "asc" },
  [SortBy.Highest]: { amount: "desc" },
  [SortBy.Lowest]: { amount: "asc" },
  [SortBy.AtoZ]: { name: "asc" },
  [SortBy.ZtoA]: { name: "desc" },
};

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

class ConstantsService {
  public readonly MaxPotNameCharacters = 20;
  public readonly TransactionRecordsPerPage = 5;
  public readonly MathDegreePercent = 3.6; // → 360 / 100;
  public readonly RecurringDueSoonDays = 15;
  // ! We can not use interpolation in Tailwind CSS
  // ! It work in build time mode and interpolation happens in run-time
  // ! https://v2.tailwindcss.com/docs/just-in-time-mode
  // Content queries - connected with @container
  // Move this to @theme {} - to --container.. variable
  public readonly ContainerQueryBreakpoint = 820;
  // public readonly WhenLessQueryBreakpoint =
  //   `@max-[${this.ContainerQueryBreakpoint}px]`;
  // public readonly WhenMoreQueryBreakpoint =
  //   `@[${this.ContainerQueryBreakpoint}px]`;
  public readonly XSmallMobileBreakpoint = 375;
  public readonly DefaultDonutChartSize = 250;
  public readonly NumberFractionDigits = 2;
  public readonly AuthEmail: string | undefined = process.env.AUTH_EMAIL;
  public readonly AuthPassword: string | undefined = process.env.AUTH_PASSWORD;

  public readonly SideBarMenuItemsConfig = [
    {
      href: "/overview",
      icon: "assets/images/icon-nav-overview.svg",
      title: "Overview",
    },
    {
      href: "/transactions",
      icon: "assets/images/icon-nav-transactions.svg",
      title: "Transactions",
    },
    {
      href: "/budgets",
      icon: "assets/images/icon-nav-budgets.svg",
      title: "Budgets",
    },
    { href: "/pots", icon: "assets/images/icon-nav-pots.svg", title: "Pots" },
    {
      href: "/recurring",
      icon: "assets/images/icon-nav-recurring-bills.svg",
      title: "Recurring Bills",
    },
  ];
}

const constants = new ConstantsService();
export default constants;
