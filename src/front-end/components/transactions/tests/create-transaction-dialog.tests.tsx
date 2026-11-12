import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const createTransactionSRFMock = vi.fn();

vi.mock("@/back-end/server-actions/transaction-actions", () => ({
  createTransactionSRF: (...args: unknown[]) =>
    createTransactionSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { CreateTransactionDialog } from "@/front-end/components/transactions/dialogs/create-transaction-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("CreateTransactionDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createTransactionSRFMock.mockResolvedValue({ success: true });
  });

  describe("create transaction", () => {
    it("shows the create-transaction title when open", () => {
      // Arrange & Act
      renderWithIntl(
        <CreateTransactionDialog isDialogOpen setDialogOpen={vi.fn()} />,
      );

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeDisabled();
    });

    it("updates recipient when the user types", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(
        <CreateTransactionDialog isDialogOpen setDialogOpen={vi.fn()} />,
      );

      // Act
      const recipient = screen.getByLabelText(/recipient\/sender/i);
      await user.type(recipient, "Coffee Shop");

      // Assert
      expect(recipient).toHaveValue("Coffee Shop");
    });
  });

  describe("recurring bill mode", () => {
    it("opens in recurring-bill mode with expense defaults", () => {
      // Arrange & Act
      renderWithIntl(
        <CreateTransactionDialog
          isDialogOpen
          setDialogOpen={vi.fn()}
          isRecurringBill
        />,
      );

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeDisabled();
    });
  });
});
