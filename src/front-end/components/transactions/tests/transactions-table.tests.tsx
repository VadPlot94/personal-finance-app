import { screen } from "@testing-library/react";
import type { Transaction } from "@prisma/client";
import { describe, expect, it } from "vitest";
import TransactionsTable from "@/front-end/components/transactions/tables/transactions-table";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { TransactionUICategory } from "@/shared/services/constants.service";

const transactions = [
  {
    id: "t-1",
    name: "Coffee Shop",
    amount: -4.5,
    category: TransactionUICategory.Entertainment,
    date: new Date("2024-01-15T12:00:00.000Z"),
    avatar: "/avatar.png",
  },
  {
    id: "t-2",
    name: "Salary",
    amount: 2500,
    category: TransactionUICategory.General,
    date: new Date("2024-01-01T12:00:00.000Z"),
    avatar: "/avatar2.png",
  },
] as Transaction[];

describe("TransactionsTable", () => {
  describe("render", () => {
    it("renders a row for each transaction", () => {
      // Arrange & Act
      renderWithIntl(<TransactionsTable transactions={transactions} />);

      // Assert
      expect(
        screen.getByRole("table", { name: /transactions/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });

    it("formats expense amounts with a minus sign", () => {
      // Arrange & Act
      renderWithIntl(<TransactionsTable transactions={transactions} />);

      // Assert
      expect(screen.getByText(/-\$4\.50/)).toBeInTheDocument();
    });

    it("formats income amounts with a plus sign", () => {
      // Arrange & Act
      renderWithIntl(<TransactionsTable transactions={transactions} />);

      // Assert
      expect(screen.getByText("+$2500.00")).toBeInTheDocument();
    });
  });
});
