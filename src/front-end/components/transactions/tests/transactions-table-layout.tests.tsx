import type { Transaction } from "@prisma/client";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllTransactionsSRFMock = vi.fn();
const getAllRecurringSRFMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/back-end/server-actions/transaction-actions", () => ({
  getAllTransactionsSRF: (...args: unknown[]) =>
    getAllTransactionsSRFMock(...args),
}));

vi.mock("@/back-end/server-actions/recurring-actions", () => ({
  getAllRecurringSRF: (...args: unknown[]) => getAllRecurringSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

import TransactionsTableLayout from "@/front-end/components/transactions/transactions-table-layout";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import {
  SortBy,
  TransactionUICategory,
} from "@/shared/services/constants.service";

const transactions = [
  {
    id: "t-1",
    name: "Coffee",
    amount: -4.5,
    category: TransactionUICategory.Entertainment,
  },
] as Transaction[];

describe("TransactionsTableLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllTransactionsSRFMock.mockResolvedValue({
      success: true,
      data: {
        transactions,
        paginationData: {
          page: 1,
          transactionsCount: 10,
          allTransactionsCount: 20,
        },
      },
    });
  });

  describe("search", () => {
    it("renders the search field and initial rows via children", () => {
      // Arrange & Act
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.map((tx) => tx.name).join(",")}</div>}
        </TransactionsTableLayout>,
      );

      // Assert
      expect(
        screen.getByRole("searchbox", { name: /search/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Coffee")).toBeInTheDocument();
    });

    it("refetches when the search value changes", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.map((tx) => tx.name).join(",")}</div>}
        </TransactionsTableLayout>,
      );

      // Act
      await user.type(
        screen.getByRole("searchbox", { name: /search/i }),
        "rent",
      );

      // Assert
      await waitFor(() => {
        expect(getAllTransactionsSRFMock).toHaveBeenCalledWith(
          expect.objectContaining({ search: "rent", page: 1 }),
        );
      });
    });
  });

  describe("sort and category", () => {
    it("refetches when sort by changes", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Act — desktop sort trigger (max-md:hidden still in DOM for jsdom)
      const sortTriggers = screen.getAllByRole("combobox", {
        name: /sort by/i,
      });
      await user.click(sortTriggers[0]);
      await user.click(await screen.findByRole("option", { name: /oldest/i }));

      // Assert
      await waitFor(() => {
        expect(getAllTransactionsSRFMock).toHaveBeenCalledWith(
          expect.objectContaining({ sortBy: SortBy.Oldest, page: 1 }),
        );
      });
    });

    it("refetches when category changes", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Act
      const categoryTriggers = screen.getAllByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTriggers[0]);
      await user.click(
        await screen.findByRole("option", { name: /entertainment/i }),
      );

      // Assert
      await waitFor(() => {
        expect(getAllTransactionsSRFMock).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TransactionUICategory.Entertainment,
            page: 1,
          }),
        );
      });
    });
  });

  describe("pagination", () => {
    it("moves to the next page when Next is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /next page/i }));

      // Assert
      await waitFor(() => {
        expect(getAllTransactionsSRFMock).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 }),
        );
      });
    });

    it("disables Previous on the first page", () => {
      // Arrange & Act
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Assert
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).toBeDisabled();
    });
  });

  describe("recurring mode", () => {
    it("uses the recurring fetch action when isRecurringOnly", async () => {
      // Arrange
      const user = userEvent.setup();
      getAllRecurringSRFMock.mockResolvedValue({
        success: true,
        data: {
          transactions,
          paginationData: {
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 10,
          },
        },
      });
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 10,
          }}
          isRecurringOnly
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Act
      await user.type(
        screen.getByRole("searchbox", { name: /search/i }),
        "netflix",
      );

      // Assert
      await waitFor(() => {
        expect(getAllRecurringSRFMock).toHaveBeenCalled();
      });
      expect(getAllTransactionsSRFMock).not.toHaveBeenCalled();
    });
  });

  describe("errors", () => {
    it("shows a toast when refetch fails", async () => {
      // Arrange
      const user = userEvent.setup();
      getAllTransactionsSRFMock.mockResolvedValue({
        success: false,
        error: "i18n.Common.UnknownError",
      });
      renderWithIntl(
        <TransactionsTableLayout
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 20,
          }}
        >
          {(items) => <div>{items.length}</div>}
        </TransactionsTableLayout>,
      );

      // Act
      await user.type(screen.getByRole("searchbox", { name: /search/i }), "x");

      // Assert
      await waitFor(() => {
        expect(toastErrorMock).toHaveBeenCalled();
      });
    });
  });
});
