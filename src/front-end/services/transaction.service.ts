import type { Transaction } from "@prisma/client";
import type { IPaginationData } from "@/front-end/components/transactions/types";
import { TransactionUICategory } from "@/shared/services/constants.service";
import translationService from "@/shared/services/translation.service";
import type { Translator } from "@/shared/services/types";

class TransactionService {
  public getValidTransactionCategory(
    categoryParam: string,
  ): TransactionUICategory | null {
    const category = (
      typeof categoryParam === "string"
        ? decodeURIComponent(categoryParam)
        : TransactionUICategory.AllTransactions
    ) as TransactionUICategory;
    return Object.values(TransactionUICategory).includes(category)
      ? category
      : null;
  }

  public getCategoryLabel(categoryValue: string, t: Translator): string {
    const categoryKey = Object.entries(TransactionUICategory).find(
      ([, value]) => value === categoryValue,
    )?.[0];
    return categoryKey
      ? t(`i18n.Enums.Category.${categoryKey}`)
      : categoryValue;
  }

  public getPaginationPagesNumber(
    paginationDataItems: Partial<IPaginationData> | undefined,
  ): number {
    const { transactionsCount, allTransactionsCount } =
      paginationDataItems || {};
    const totalPages =
      transactionsCount && transactionsCount > 0
        ? Math.ceil((allTransactionsCount || 1) / (transactionsCount || 1))
        : 1;
    return totalPages;
  }

  public getSearchValue(searchValue: string): string {
    return searchValue?.trim();
  }

  public isNoTransactionsSearchFound(
    searchValue: string,
    transactions: Transaction[],
  ): boolean {
    return !transactions?.length && !!this.getSearchValue(searchValue);
  }

  public getTransactionDate(
    date: Date,
    locale: string = translationService.DefaultLocale,
  ): string {
    return date
      ? new Date(date).toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "--";
  }

  public getTransactionAmount(amount: number): string {
    return `${amount > 0 ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;
  }
}

const transactionService = new TransactionService();
export default transactionService;
