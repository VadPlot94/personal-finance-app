import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Pot } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/back-end/server-actions/pot-actions", () => ({
  setPotTotalSRF: vi.fn(),
  editPotSRF: vi.fn(),
  deletePotSRF: vi.fn(),
}));

vi.mock("@/front-end/components/pots/dialogs/change-money-dialog", () => ({
  ChangeMoneyDialog: ({
    isWithdraw,
    isDialogOpen,
  }: {
    isWithdraw?: boolean;
    isDialogOpen: boolean;
  }) =>
    isDialogOpen ? (
      <div role="dialog">{isWithdraw ? "Withdraw dialog" : "Add money dialog"}</div>
    ) : null,
}));

vi.mock("@/front-end/components/pots/pots-menu", () => ({
  PotsMenu: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import PotsItem from "@/front-end/components/pots/pots-item";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { Theme } from "@/shared/services/constants.service";

const pot = {
  id: "p-1",
  name: "Vacation",
  total: 50,
  target: 100,
  theme: Theme.Green,
} as Pot;

describe("PotsItem", () => {
  describe("render", () => {
    it("shows pot name, totals, and progress", () => {
      // Arrange & Act
      renderWithIntl(<PotsItem pot={pot} availableBalance={500} />);

      // Assert
      expect(screen.getByText("Vacation")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "50",
      );
    });
  });

  describe("money actions", () => {
    it("opens the add-money dialog", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<PotsItem pot={pot} availableBalance={500} />);

      // Act
      await user.click(screen.getByRole("button", { name: /add money/i }));

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/add money/i);
    });

    it("opens the withdraw dialog", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<PotsItem pot={pot} availableBalance={500} />);

      // Act
      await user.click(screen.getByRole("button", { name: /withdraw/i }));

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/withdraw/i);
    });
  });
});
