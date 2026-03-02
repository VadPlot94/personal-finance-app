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

class ConstantsService {
  public MaxPotNameCharacters = 20;
  public TransactionRecordsPerPage = 5;
  public MathDegreePercent = 3.6; // → 360 / 100;
}

const constants = new ConstantsService();
export default constants;
