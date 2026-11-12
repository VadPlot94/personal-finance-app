import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("EmptyContentWrapper", () => {
  describe("loading state", () => {
    it("shows loading copy when isLoading is true", () => {
      // Arrange & Act
      renderWithIntl(
        <EmptyContentWrapper
          hasItems={false}
          isLoading
          emptyTitle="Nothing here"
        />,
      );

      // Assert
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText("Nothing here")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty title and body when there are no items", () => {
      // Arrange & Act
      renderWithIntl(
        <EmptyContentWrapper
          hasItems={false}
          emptyTitle="No pots yet"
          emptyBody="Create one to start"
        />,
      );

      // Assert
      expect(screen.getByText("No pots yet")).toBeInTheDocument();
      expect(screen.getByText("Create one to start")).toBeInTheDocument();
    });
  });

  describe("content state", () => {
    it("renders children when hasItems is true", () => {
      // Arrange & Act
      renderWithIntl(
        <EmptyContentWrapper hasItems emptyTitle="No pots yet">
          <p>Pot list</p>
        </EmptyContentWrapper>,
      );

      // Assert
      expect(screen.getByText("Pot list")).toBeInTheDocument();
      expect(screen.queryByText("No pots yet")).not.toBeInTheDocument();
    });
  });
});
