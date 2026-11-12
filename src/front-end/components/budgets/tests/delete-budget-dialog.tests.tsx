import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Budget } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const deleteBudgetSRFMock = vi.fn();

vi.mock("@/back-end/server-actions/budget-actions", () => ({
  deleteBudgetSRF: (...args: unknown[]) => deleteBudgetSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { DeleteBudgetDialog } from "@/front-end/components/budgets/dialogs/delete-budget-dialog";
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

describe("DeleteBudgetDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteBudgetSRFMock.mockResolvedValue({ success: true });
  });

  describe("actions", () => {
    it("calls deleteBudgetSRF when Delete is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const setDialogOpen = vi.fn();
      renderWithIntl(
        <DeleteBudgetDialog
          budget={budget}
          isDialogOpen
          setDialogOpen={setDialogOpen}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /^delete$/i }));

      // Assert
      expect(deleteBudgetSRFMock).toHaveBeenCalledWith("b-1");
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
  });
});
