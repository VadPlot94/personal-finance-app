import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Budget } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: vi.fn(),
}));

vi.mock("@/front-end/components/budgets/dialogs/edit-budget-dialog", () => ({
  EditBudgetDialog: ({
    isDialogOpen,
    budget,
  }: {
    isDialogOpen: boolean;
    budget?: Budget | null;
  }) =>
    isDialogOpen ? (
      <div role="dialog">
        {budget ? `Edit ${budget.category}` : "Add budget dialog"}
      </div>
    ) : null,
}));

vi.mock("@/front-end/components/budgets/dialogs/delete-budget-dialog", () => ({
  DeleteBudgetDialog: ({
    isDialogOpen,
    budget,
  }: {
    isDialogOpen: boolean;
    budget?: Budget | null;
  }) =>
    isDialogOpen ? (
      <div role="dialog">Delete {budget?.category}</div>
    ) : null,
}));

vi.mock("@/front-end/components/budgets/budget-donut-chart", () => ({
  default: () => <div>Donut chart</div>,
}));

import Budgets from "@/front-end/components/budgets/budgets";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

const budgets = [
  {
    id: "b-1",
    category: TransactionUICategory.Entertainment,
    maximum: 100,
    theme: Theme.Green,
  },
] as Budget[];

describe("Budgets", () => {
  describe("render", () => {
    it("shows budget cards and the donut", () => {
      // Arrange & Act
      renderWithIntl(
        <Budgets
          budgets={budgets}
          transactionsByCategoryList={[
            {
              category: TransactionUICategory.Entertainment,
              transactions: [{ amount: -40 } as never],
            },
          ]}
        />,
      );

      // Assert
      expect(screen.getByText("Donut chart")).toBeInTheDocument();
      expect(screen.getByText(/entertainment/i)).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("opens the add-budget dialog from the header", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<Budgets budgets={budgets} />);

      // Act
      await user.click(screen.getByRole("button", { name: /add budget/i }));

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/add budget/i);
    });

    it("opens the edit dialog from a budget menu", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<Budgets budgets={budgets} />);

      // Act
      await user.click(screen.getByRole("img", { name: /actions/i }));
      await user.click(
        await screen.findByRole("menuitem", { name: /edit budget/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/edit entertainment/i);
    });

    it("opens the delete dialog from a budget menu", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<Budgets budgets={budgets} />);

      // Act
      await user.click(screen.getByRole("img", { name: /actions/i }));
      await user.click(
        await screen.findByRole("menuitem", { name: /delete budget/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/delete entertainment/i);
    });
  });
});
