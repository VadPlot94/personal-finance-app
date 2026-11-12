import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Budget } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import BudgetsItem from "@/front-end/components/budgets/budgets-item";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

const budget = {
  id: "b-1",
  category: TransactionUICategory.Entertainment,
  maximum: 100,
  theme: Theme.Green,
} as Budget;

const transactionsByCategoryList = [
  {
    category: TransactionUICategory.Entertainment,
    transactions: [
      { id: "t-1", name: "Cinema", amount: -40 } as never,
      { id: "t-2", name: "Games", amount: -20 } as never,
    ],
  },
];

describe("BudgetsItem", () => {
  describe("render", () => {
    it("shows category, progress, and latest transactions", () => {
      // Arrange & Act
      renderWithIntl(
        <BudgetsItem
          budget={budget}
          transactionsByCategoryList={transactionsByCategoryList}
        />,
      );

      // Assert
      expect(screen.getByText(/entertainment/i)).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByText("Cinema")).toBeInTheDocument();
    });
  });

  describe("menu", () => {
    it("forwards edit from the menu", async () => {
      // Arrange
      const user = userEvent.setup();
      const onEditBudget = vi.fn();
      renderWithIntl(
        <BudgetsItem
          budget={budget}
          transactionsByCategoryList={transactionsByCategoryList}
          onEditBudget={onEditBudget}
        />,
      );

      // Act
      await user.click(screen.getByRole("img", { name: /actions/i }));
      await user.click(
        await screen.findByRole("menuitem", { name: /edit budget/i }),
      );

      // Assert
      expect(onEditBudget).toHaveBeenCalledWith(budget);
    });
  });
});
