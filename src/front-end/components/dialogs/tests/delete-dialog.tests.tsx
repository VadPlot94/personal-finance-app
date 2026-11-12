import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("DeleteDialog", () => {
  describe("open state", () => {
    it("shows the item name in the title when open", () => {
      // Arrange & Act
      renderWithIntl(
        <DeleteDialog
          data={{ name: "Vacation" }}
          isDialogOpen
          setDialogOpen={vi.fn()}
          handleDeleteClick={vi.fn()}
        />,
      );

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Vacation/i }),
      ).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("closes when Go Back is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const setDialogOpen = vi.fn();
      renderWithIntl(
        <DeleteDialog
          data={{ name: "Vacation" }}
          isDialogOpen
          setDialogOpen={setDialogOpen}
          handleDeleteClick={vi.fn()}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /go back/i }));

      // Assert
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });

    it("calls handleDeleteClick when Delete is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleDeleteClick = vi.fn();
      renderWithIntl(
        <DeleteDialog
          data={{ name: "Vacation" }}
          isDialogOpen
          setDialogOpen={vi.fn()}
          handleDeleteClick={handleDeleteClick}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /^delete$/i }));

      // Assert
      expect(handleDeleteClick).toHaveBeenCalledTimes(1);
    });
  });
});
