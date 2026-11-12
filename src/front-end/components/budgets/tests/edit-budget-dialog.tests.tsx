import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Budget } from "@prisma/client";
import type { Context } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const addBudgetSRFMock = vi.fn();
const editBudgetSRFMock = vi.fn();

const { BudgetsContext } = vi.hoisted(() => {
  const React = require("react") as typeof import("react");
  return {
    BudgetsContext: React.createContext([]) as Context<Budget[]>,
  };
});

vi.mock("@/back-end/server-actions/budget-actions", () => ({
  addBudgetSRF: (...args: unknown[]) => addBudgetSRFMock(...args),
  editBudgetSRF: (...args: unknown[]) => editBudgetSRFMock(...args),
}));

vi.mock("@/front-end/components/budgets/budgets", () => ({
  BudgetsContext,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { EditBudgetDialog } from "@/front-end/components/budgets/dialogs/edit-budget-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

const existingBudget = {
  id: "b-1",
  category: TransactionUICategory.Entertainment,
  maximum: 100,
  theme: Theme.Green,
} as Budget;

function renderDialog(
  props: Partial<React.ComponentProps<typeof EditBudgetDialog>> = {},
) {
  return renderWithIntl(
    <BudgetsContext value={[existingBudget]}>
      <EditBudgetDialog isDialogOpen setDialogOpen={vi.fn()} {...props} />
    </BudgetsContext>,
  );
}

describe("EditBudgetDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addBudgetSRFMock.mockResolvedValue({ success: true });
    editBudgetSRFMock.mockResolvedValue({ success: true });
  });

  describe("add mode", () => {
    it("shows the add-budget title when no budget is provided", () => {
      // Arrange & Act
      renderDialog();

      // Assert
      expect(
        screen.getByRole("heading", { name: /add new budget/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeDisabled();
    });

    it("updates the maximum field when the user types", async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog();

      // Act
      await user.type(screen.getByLabelText(/maximum/i), "150");

      // Assert
      expect(screen.getByLabelText(/maximum/i)).toHaveValue("150");
    });
  });

  describe("edit mode", () => {
    it("prefills fields from the existing budget", () => {
      // Arrange & Act
      renderDialog({ budget: existingBudget });

      // Assert
      expect(
        screen.getByRole("heading", { name: /edit new budget/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/maximum/i)).toHaveValue("100");
    });
  });
});
