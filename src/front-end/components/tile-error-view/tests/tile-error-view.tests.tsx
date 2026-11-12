import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/shared/lib/test-utils/logger.service.mock";
import TileErrorView from "@/front-end/components/tile-error-view/tile-error-view";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import logger from "@/shared/services/logger.service";

describe("TileErrorView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("render", () => {
    it("shows tile error copy and a retry button", () => {
      // Arrange & Act
      renderWithIntl(
        <TileErrorView
          error={{ message: "boom", name: "Error" }}
          retry={vi.fn()}
        />,
      );

      // Assert
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
      expect(logger.logError).toHaveBeenCalled();
    });
  });

  describe("retry", () => {
    it("calls retry when the button is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const retry = vi.fn();
      renderWithIntl(
        <TileErrorView
          error={{ message: "boom", name: "Error" }}
          retry={retry}
        />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /try again/i }));

      // Assert
      expect(retry).toHaveBeenCalledTimes(1);
    });
  });
});
