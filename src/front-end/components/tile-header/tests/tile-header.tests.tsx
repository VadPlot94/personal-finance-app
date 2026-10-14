import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TileHeader from "@/front-end/components/tile-header/tile-header";

describe("TileHeader", () => {
  describe("render", () => {
    it("renders the title", () => {
      // Arrange
      const props = {
        title: "Transactions",
        href: "/transactions",
        linkLabel: "See all",
      };

      // Act
      render(<TileHeader {...props} />);

      // Assert
      expect(screen.getByText("Transactions")).toBeInTheDocument();
    });

    it("renders the link label", () => {
      // Arrange
      const props = {
        title: "Transactions",
        href: "/transactions",
        linkLabel: "See all",
      };

      // Act
      render(<TileHeader {...props} />);

      // Assert
      expect(
        screen.getByRole("link", { name: /See all/i }),
      ).toBeInTheDocument();
    });

    it("sets the link href", () => {
      // Arrange
      const props = {
        title: "Transactions",
        href: "/transactions",
        linkLabel: "See all",
      };

      // Act
      render(<TileHeader {...props} />);

      // Assert
      expect(screen.getByRole("link", { name: /See all/i })).toHaveAttribute(
        "href",
        "/transactions",
      );
    });
  });
});
