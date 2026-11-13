import type { Pot } from "@prisma/client";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setPotTotalSRFMock = vi.fn();

vi.mock("@/back-end/server-actions/pot-actions", () => ({
  setPotTotalSRF: (...args: unknown[]) => setPotTotalSRFMock(...args),
}));

import { ChangeMoneyDialog } from "@/front-end/components/pots/dialogs/change-money-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { Theme } from "@/shared/services/constants.service";

const pot = {
  id: "p-1",
  name: "Vacation",
  total: 50,
  target: 200,
  theme: Theme.Green,
} as Pot;

describe("ChangeMoneyDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("add money", () => {
    it("shows the add title when open", () => {
      // Arrange & Act
      renderWithIntl(
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={500}
          isDialogOpen
          setDialogOpen={vi.fn()}
        />,
      );

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/vacation/i);
      expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();
    });

    it("updates the projected total when amount is entered", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={500}
          isDialogOpen
          setDialogOpen={vi.fn()}
        />,
      );

      // Act
      await user.type(screen.getByLabelText(/amount to add/i), "25");

      // Assert
      expect(screen.getByText(/75/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /confirm/i })).toBeEnabled();
    });

    it("submits the new total on confirm", async () => {
      // Arrange
      const user = userEvent.setup();
      const setDialogOpen = vi.fn();
      setPotTotalSRFMock.mockResolvedValue({ success: true });
      renderWithIntl(
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={500}
          isDialogOpen
          setDialogOpen={setDialogOpen}
        />,
      );
      await user.type(screen.getByLabelText(/amount to add/i), "25");

      // Act
      await user.click(screen.getByRole("button", { name: /confirm/i }));

      // Assert
      await waitFor(() => {
        expect(setPotTotalSRFMock).toHaveBeenCalledWith("p-1", 75);
      });
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("withdraw", () => {
    it("uses withdraw copy and reduces the projected total", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={500}
          isWithdraw
          isDialogOpen
          setDialogOpen={vi.fn()}
        />,
      );

      // Act
      await user.type(screen.getByLabelText(/amount to withdraw/i), "10");

      // Assert
      expect(screen.getByText(/40/)).toBeInTheDocument();
    });
  });
});
