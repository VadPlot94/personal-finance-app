import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: vi.fn(),
}));

vi.mock("@/back-end/server-actions/transaction-actions", () => ({
  getAllTransactionsSRF: vi.fn(),
  createTransactionSRF: vi.fn(),
}));

vi.mock("@/back-end/server-actions/recurring-actions", () => ({
  getAllRecurringSRF: vi.fn(),
}));

vi.mock(
  "@/front-end/components/transactions/dialogs/create-transaction-dialog",
  () => ({
    CreateTransactionDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
      isDialogOpen ? <div role="dialog">Create transaction dialog</div> : null,
  }),
);

import Transactions from "@/front-end/components/transactions/transactions";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { TransactionUICategory } from "@/shared/services/constants.service";

const transactions = [
  {
    id: "t-1",
    name: "Coffee Shop",
    amount: -4.5,
    category: TransactionUICategory.Entertainment,
    date: new Date("2024-01-15"),
    avatar: "/avatar.png",
  },
] as Transaction[];

describe("Transactions", () => {
  describe("render", () => {
    it("shows the transactions table and search controls", () => {
      // Arrange & Act
      renderWithIntl(
        <Transactions
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 1,
          }}
        />,
      );

      // Assert
      expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
      expect(
        screen.getByRole("searchbox", { name: /search/i }),
      ).toBeInTheDocument();
    });
  });

  describe("create", () => {
    it("opens the create-transaction dialog from the header", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <Transactions
          transactions={transactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 1,
          }}
        />,
      );

      // Act
      await user.click(
        screen.getByRole("button", { name: /create transaction|add/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(
        /create transaction/i,
      );
    });
  });
});
