import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: vi.fn(),
}));

import PageHeader from "@/front-end/components/page-header/page-header";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("PageHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("render", () => {
    it("renders the page title", () => {
      // Arrange & Act
      renderWithIntl(<PageHeader name="Pots" />);

      // Assert
      expect(screen.getByText("Pots")).toBeInTheDocument();
    });

    it("renders the locale switcher", () => {
      // Arrange & Act
      renderWithIntl(<PageHeader name="Pots" />);

      // Assert
      expect(
        screen.getByRole("combobox", { name: /language/i }),
      ).toBeInTheDocument();
    });
  });

  describe("action button", () => {
    it("does not render an action button without buttonName", () => {
      // Arrange & Act
      renderWithIntl(<PageHeader name="Pots" />);

      // Assert
      expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    });

    it("calls handleButtonClick when the action button is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleButtonClick = vi.fn();
      renderWithIntl(
        <PageHeader
          name="Pots"
          buttonName="Add New Pot"
          handleButtonClick={handleButtonClick}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Add New Pot" }));

      // Assert
      expect(handleButtonClick).toHaveBeenCalledTimes(1);
    });
  });
});
