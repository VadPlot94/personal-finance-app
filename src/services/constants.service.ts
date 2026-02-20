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

export enum TransactionCategory {
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

export const sortByDataBaseFieldMap: Record<SortBy, keyof Transaction> = {
  [SortBy.Latest]: "date",
  [SortBy.Oldest]: "date",
  [SortBy.Highest]: "amount",
  [SortBy.Lowest]: "amount",
  [SortBy.AtoZ]: "name",
  [SortBy.ZtoA]: "name",
};

class ConstantsService {
  public MaxPotNameCharacters = 20;
  public TransactionRecordsPerPage = 5;
}

const constants = new ConstantsService();
export default constants;
