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

export enum AuthMode {
  SignIn = "signin",
  Register = "register",
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
  public readonly DefaultUserAvatarIconUrl =
    "assets/images/avatars/dummy-avatar.jpg";
  public readonly AppRoutes = {
    home: "/",
    login: "/login",
    overview: "/overview",
    transactions: "/transactions",
    budgets: "/budgets",
    pots: "/pots",
    recurring: "/recurring",
  } as const;

  public readonly SideBarNavMenuItemsConfig = [
    {
      href: this.AppRoutes.overview,
      iconUrl: "assets/images/icon-nav-overview.svg",
      titleI18nKey: "i18n.Navigation.Overview",
      isPrefetch: true,
    },
    {
      href: this.AppRoutes.transactions,
      iconUrl: "assets/images/icon-nav-transactions.svg",
      titleI18nKey: "i18n.Navigation.Transactions",
      isPrefetch: true,
    },
    {
      href: this.AppRoutes.budgets,
      iconUrl: "assets/images/icon-nav-budgets.svg",
      titleI18nKey: "i18n.Navigation.Budgets",
      isPrefetch: true,
    },
    {
      href: this.AppRoutes.pots,
      iconUrl: "assets/images/icon-nav-pots.svg",
      titleI18nKey: "i18n.Navigation.Pots",
      isPrefetch: true,
    },
    {
      href: this.AppRoutes.recurring,
      iconUrl: "assets/images/icon-nav-recurring-bills.svg",
      titleI18nKey: "i18n.Navigation.Recurring",
      isPrefetch: true,
    },
  ];

  public SignOutMenuItemConfig = {
    href: this.AppRoutes.home,
    iconUrl: "assets/images/icon-logout.svg",
    titleI18nKey: "i18n.Navigation.SignOut",
  };
}

const constants = new ConstantsService();
export default constants;
