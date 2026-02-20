import { IPaginationData } from "@/components/types";

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
}

const transactionService = new TransactionService();
export default transactionService;
