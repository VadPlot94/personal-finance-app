import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import translationService from "@/shared/services/translation.service";

function renderTileHeader(props: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return render(
    <NextIntlClientProvider
      locale={translationService.DefaultLocale}
      messages={translationService.DefaultMessages}
    >
      <TileHeader {...props} />
    </NextIntlClientProvider>,
  );
}

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
      renderTileHeader(props);

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
      renderTileHeader(props);

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
      renderTileHeader(props);

      // Assert
      expect(screen.getByRole("link", { name: /See all/i })).toHaveAttribute(
        "href",
        "/transactions",
      );
    });
  });
});
