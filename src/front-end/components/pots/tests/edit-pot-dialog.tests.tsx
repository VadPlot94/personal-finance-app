import type { Pot } from "@prisma/client";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const createPotSRFMock = vi.fn();
const editPotSRFMock = vi.fn();

const { PotsContext } = vi.hoisted(() => {
  const React = require("react") as typeof import("react");
  return {
    PotsContext: React.createContext<Pot[]>([]),
  };
});

vi.mock("@/back-end/server-actions/pot-actions", () => ({
  createPotSRF: (...args: unknown[]) => createPotSRFMock(...args),
  editPotSRF: (...args: unknown[]) => editPotSRFMock(...args),
}));

vi.mock("@/front-end/components/pots/pots", () => ({
  PotsContext,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { EditPotDialog } from "@/front-end/components/pots/dialogs/edit-pot-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { Theme } from "@/shared/services/constants.service";

const existingPot = {
  id: "p-1",
  name: "Vacation",
  total: 50,
  target: 100,
  theme: Theme.Green,
} as Pot;

function renderDialog(
  props: Partial<React.ComponentProps<typeof EditPotDialog>> = {},
) {
  return renderWithIntl(
    <PotsContext value={[existingPot]}>
      <EditPotDialog isDialogOpen setDialogOpen={vi.fn()} {...props} />
    </PotsContext>,
  );
}

describe("EditPotDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createPotSRFMock.mockResolvedValue({ success: true });
    editPotSRFMock.mockResolvedValue({ success: true });
  });

  describe("add mode", () => {
    it("shows the add title when no pot is provided", () => {
      // Arrange & Act
      renderDialog();

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeDisabled();
    });

    it("updates the pot name when the user types", async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog();
      const nameInput = screen.getByLabelText(/pot name|name/i);

      // Act
      await user.type(nameInput, "Holiday");

      // Assert
      expect(nameInput).toHaveValue("Holiday");
    });
  });

  describe("edit mode", () => {
    it("prefills fields from the existing pot", () => {
      // Arrange & Act
      renderDialog({ pot: existingPot });

      // Assert
      expect(screen.getByDisplayValue("Vacation")).toBeInTheDocument();
    });
  });
});
