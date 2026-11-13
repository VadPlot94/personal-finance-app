import type { Transaction } from "@prisma/client";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: vi.fn(),
}));

vi.mock("@/back-end/server-actions/recurring-actions", () => ({
  getAllRecurringSRF: vi.fn(),
}));

vi.mock("@/back-end/server-actions/transaction-actions", () => ({
  getAllTransactionsSRF: vi.fn(),
  createTransactionSRF: vi.fn(),
}));

vi.mock(
  "@/front-end/components/transactions/dialogs/create-transaction-dialog",
  () => ({
    CreateTransactionDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
      isDialogOpen ? <div role="dialog">Add recurring bill dialog</div> : null,
  }),
);

vi.mock("@/front-end/components/transactions/tables/bills-table", () => ({
  default: ({ transactions }: { transactions: Transaction[] }) => (
    <div>
      {transactions.map((tx) => (
        <div key={tx.id}>{tx.name}</div>
      ))}
    </div>
  ),
}));

import Recurring from "@/front-end/components/recurring/recurring";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

const recurringTransactions = [
  {
    id: "r-1",
    name: "Netflix",
    amount: -15.99,
    date: new Date("2024-06-10T12:00:00.000Z"),
  },
] as Transaction[];

describe("Recurring", () => {
  describe("render", () => {
    it("shows recurring bills after the reference date mounts", async () => {
      // Arrange & Act
      renderWithIntl(
        <Recurring
          recurringTransactions={recurringTransactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 1,
          }}
        />,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Netflix")).toBeInTheDocument();
      });
    });
  });

  describe("add bill", () => {
    it("opens the create dialog from the header", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <Recurring
          recurringTransactions={recurringTransactions}
          paginationData={{
            page: 1,
            transactionsCount: 10,
            allTransactionsCount: 1,
          }}
        />,
      );

      // Act
      await user.click(
        screen.getByRole("button", { name: /add recurring bill/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(
        /add recurring bill/i,
      );
    });
  });
});
