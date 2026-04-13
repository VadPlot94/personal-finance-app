import { IPaginationData } from "@/front-end/components/types";
import { Transaction } from "@prisma/client";

class TransactionService {
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

  public getTransactionDate(date: Date): string {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
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
