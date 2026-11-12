import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Pot } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const deletePotSRFMock = vi.fn();

vi.mock("@/back-end/server-actions/pot-actions", () => ({
  deletePotSRF: (...args: unknown[]) => deletePotSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { DeletePotDialog } from "@/front-end/components/pots/dialogs/delete-pot-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { Theme } from "@/shared/services/constants.service";

const pot = {
  id: "p-1",
  name: "Vacation",
  total: 50,
  target: 100,
  theme: Theme.Green,
} as Pot;

describe("DeletePotDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deletePotSRFMock.mockResolvedValue({ success: true });
  });

  describe("actions", () => {
    it("calls deletePotSRF when Delete is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const setDialogOpen = vi.fn();
      renderWithIntl(
        <DeletePotDialog
          pot={pot}
          isDialogOpen
          setDialogOpen={setDialogOpen}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /^delete$/i }));

      // Assert
      expect(deletePotSRFMock).toHaveBeenCalledWith("p-1");
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
  });
});
