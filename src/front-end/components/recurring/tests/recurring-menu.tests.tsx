import type { Transaction } from "@prisma/client";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock(
  "@/front-end/components/recurring/dialogs/delete-recurring-dialog",
  () => ({
    DeleteRecurringDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
      isDialogOpen ? <div role="dialog">Delete recurring dialog</div> : null,
  }),
);

import { RecurringMenu } from "@/front-end/components/recurring/recurring-menu";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

const recurringTransaction = {
  id: "r-1",
  name: "Netflix",
} as Transaction;

describe("RecurringMenu", () => {
  describe("actions", () => {
    it("opens the delete dialog when Delete is chosen", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <RecurringMenu recurringTransaction={recurringTransaction}>
          <button type="button">Open menu</button>
        </RecurringMenu>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(
        await screen.findByRole("menuitem", {
          name: /delete recurring/i,
        }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/delete recurring/i);
    });
  });
});
