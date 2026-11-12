import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SidebarVisibilityShell from "@/front-end/components/sidebar-visibility-shell/sidebar-visibility-shell";
import { installMatchMediaMock } from "@/front-end/lib/test-utils/match-media.mock";

describe("SidebarVisibilityShell", () => {
  afterEach(() => {
    // Restore a permissive default for later suites.
    installMatchMediaMock(true);
  });

  describe("md breakpoint", () => {
    it("marks the vertical shell inert below md", () => {
      // Arrange
      installMatchMediaMock(false);

      // Act
      render(
        <SidebarVisibilityShell variant="vertical" className="vertical-shell">
          <button type="button">Vertical nav</button>
        </SidebarVisibilityShell>,
      );

      // Assert
      expect(screen.getByText("Vertical nav").parentElement).toHaveAttribute(
        "inert",
      );
    });

    it("marks the horizontal shell inert at md and above", () => {
      // Arrange
      installMatchMediaMock(true);

      // Act
      render(
        <SidebarVisibilityShell
          variant="horizontal"
          className="horizontal-shell"
        >
          <button type="button">Horizontal nav</button>
        </SidebarVisibilityShell>,
      );

      // Assert
      expect(screen.getByText("Horizontal nav").parentElement).toHaveAttribute(
        "inert",
      );
    });

    it("updates inert when the viewport crosses md", () => {
      // Arrange
      const media = installMatchMediaMock(false);
      render(
        <SidebarVisibilityShell variant="vertical">
          <button type="button">Vertical nav</button>
        </SidebarVisibilityShell>,
      );
      const shell = screen.getByText("Vertical nav").parentElement;

      // Assert initial
      expect(shell).toHaveAttribute("inert");

      // Act — resize to md+
      act(() => {
        media.setMatches(true);
      });

      // Assert
      expect(shell).not.toHaveAttribute("inert");
    });
  });
});
