import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/shared/lib/test-utils/logger.service.mock";
import ErrorView from "@/front-end/components/error-view/error-view";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import logger from "@/shared/services/logger.service";

describe("ErrorView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("render", () => {
    it("shows the error title and try-again action", () => {
      // Arrange & Act
      renderWithIntl(
        <ErrorView error={{ message: "boom", name: "Error" }} retry={vi.fn()} />,
      );

      // Assert
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it("shows the digest when provided", () => {
      // Arrange & Act
      renderWithIntl(
        <ErrorView
          error={{ message: "boom", name: "Error", digest: "abc123" }}
          retry={vi.fn()}
        />,
      );

      // Assert
      expect(screen.getByText(/abc123/)).toBeInTheDocument();
    });
  });

  describe("retry", () => {
    it("calls retry when the button is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const retry = vi.fn();
      renderWithIntl(
        <ErrorView error={{ message: "boom", name: "Error" }} retry={retry} />,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /try again/i }));

      // Assert
      expect(retry).toHaveBeenCalledTimes(1);
    });
  });

  describe("logging", () => {
    it("logs the error on mount", () => {
      // Arrange & Act
      renderWithIntl(
        <ErrorView
          error={{ message: "boom", name: "Error", digest: "d1" }}
          retry={vi.fn()}
          logArea="[test]"
        />,
      );

      // Assert
      expect(logger.logError).toHaveBeenCalled();
    });
  });
});
