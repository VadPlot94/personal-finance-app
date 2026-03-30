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
  public MaxPotNameCharacters = 20;
  public TransactionRecordsPerPage = 5;
  public MathDegreePercent = 3.6; // → 360 / 100;
  public RecurringDueSoonDays = 15;
  // Content queries - connected with @container
  private containerQueryBreakpoint = "580px";
  public whenLessQueryBreakpoint = `@max-[${this.containerQueryBreakpoint}]`;
  public whenMoreQueryBreakpoint = `@[${this.containerQueryBreakpoint}]`;
  public NumberFractionDigits = 2;
  public SideBarMenuItemsConfig = [
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
