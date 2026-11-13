import type { Budget } from "@prisma/client";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BudgetsMenu } from "@/front-end/components/budgets/budgets-menu";
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

describe("BudgetsMenu", () => {
  describe("actions", () => {
    it("calls onEditBudget when Edit is chosen", async () => {
      // Arrange
      const user = userEvent.setup();
      const onEditBudget = vi.fn();
      renderWithIntl(
        <BudgetsMenu budget={budget} onEditBudget={onEditBudget}>
          <button type="button">Open menu</button>
        </BudgetsMenu>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /edit budget/i }),
      );

      // Assert
      expect(onEditBudget).toHaveBeenCalledWith(budget);
    });

    it("calls onDeleteBudget when Delete is chosen", async () => {
      // Arrange
      const user = userEvent.setup();
      const onDeleteBudget = vi.fn();
      renderWithIntl(
        <BudgetsMenu budget={budget} onDeleteBudget={onDeleteBudget}>
          <button type="button">Open menu</button>
        </BudgetsMenu>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /delete budget/i }),
      );

      // Assert
      expect(onDeleteBudget).toHaveBeenCalledWith(budget);
    });
  });
});
