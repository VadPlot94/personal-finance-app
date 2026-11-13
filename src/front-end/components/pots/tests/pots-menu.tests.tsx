import type { Pot } from "@prisma/client";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/front-end/components/pots/dialogs/edit-pot-dialog", () => ({
  EditPotDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
    isDialogOpen ? <div role="dialog">Edit pot dialog</div> : null,
}));

vi.mock("@/front-end/components/pots/dialogs/delete-pot-dialog", () => ({
  DeletePotDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
    isDialogOpen ? <div role="dialog">Delete pot dialog</div> : null,
}));

import { PotsMenu } from "@/front-end/components/pots/pots-menu";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { Theme } from "@/shared/services/constants.service";

const pot = {
  id: "p-1",
  name: "Vacation",
  total: 50,
  target: 100,
  theme: Theme.Green,
} as Pot;

describe("PotsMenu", () => {
  describe("actions", () => {
    it("opens the edit dialog when Edit is chosen", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <PotsMenu pot={pot}>
          <button type="button">Open menu</button>
        </PotsMenu>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /edit pot/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/edit pot/i);
    });

    it("opens the delete dialog when Delete is chosen", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <PotsMenu pot={pot}>
          <button type="button">Open menu</button>
        </PotsMenu>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /delete pot/i }),
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/delete pot/i);
    });
  });
});
