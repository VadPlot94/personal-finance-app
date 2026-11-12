import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const deleteRecurringSRFMock = vi.fn();

vi.mock("@/back-end/server-actions/recurring-actions", () => ({
  deleteRecurringSRF: (...args: unknown[]) => deleteRecurringSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { DeleteRecurringDialog } from "@/front-end/components/recurring/dialogs/delete-recurring-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

const recurringTransaction = {
  id: "r-1",
  name: "Netflix",
} as Transaction;

describe("DeleteRecurringDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteRecurringSRFMock.mockResolvedValue({ success: true });
  });

  describe("actions", () => {
    it("calls deleteRecurringSRF when Delete is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const setDialogOpen = vi.fn();
      renderWithIntl(
        <DeleteRecurringDialog
          recurringTransaction={recurringTransaction}
          isDialogOpen
          setDialogOpen={setDialogOpen}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /^delete$/i }));

      // Assert
      expect(deleteRecurringSRFMock).toHaveBeenCalledWith("r-1");
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
  });
});
