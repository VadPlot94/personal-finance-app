import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingIndicator from "@/front-end/components/loading-indicator/loading-indicator";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("LoadingIndicator", () => {
  describe("inline mode", () => {
    it("shows a spinner when children are missing", () => {
      // Arrange & Act
      renderWithIntl(<LoadingIndicator />);

      // Assert
      expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
    });

    it("renders children when provided and link is not pending", () => {
      // Arrange & Act
      renderWithIntl(
        <LoadingIndicator>
          <span>Ready</span>
        </LoadingIndicator>,
      );

      // Assert
      expect(screen.getByText("Ready")).toBeInTheDocument();
      expect(screen.queryByAltText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe("fullScreen mode", () => {
    it("exposes a polite loading output", () => {
      // Arrange & Act
      renderWithIntl(<LoadingIndicator fullScreen />);

      // Assert
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
    });
  });
});
