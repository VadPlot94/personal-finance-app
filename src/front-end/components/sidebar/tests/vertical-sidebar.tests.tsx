import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useSessionMock = vi.fn();
const usePathnameMock = vi.fn();
const signOutMock = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock("@/front-end/services/auth.service", () => ({
  default: {
    signOut: (...args: unknown[]) => signOutMock(...args),
  },
}));

import VerticalSidebar from "@/front-end/components/sidebar/vertical-sidebar";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants from "@/shared/services/constants.service";

describe("VerticalSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePathnameMock.mockReturnValue(constants.AppRoutes.overview);
    useSessionMock.mockReturnValue({
      data: { user: { id: "user-1", name: "Ada Lovelace", image: null } },
      status: "authenticated",
    });
  });

  describe("navigation", () => {
    it("marks the active route after mount", async () => {
      // Arrange & Act
      renderWithIntl(<VerticalSidebar />);

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /overview/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });
  });

  describe("menu toggle", () => {
    it("starts collapsed with aria-expanded false", async () => {
      // Arrange & Act
      renderWithIntl(<VerticalSidebar />);
      const toggle = await screen.findByRole("button", {
        name: /maximize menu/i,
      });

      // Assert
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("expands when Maximize Menu is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);
      const toggle = await screen.findByRole("button", {
        name: /maximize menu/i,
      });

      // Act
      await user.click(toggle);

      // Assert
      expect(
        screen.getByRole("button", { name: /minimize menu/i }),
      ).toHaveAttribute("aria-expanded", "true");
    });

    it("hides nav label spans while collapsed", async () => {
      // Arrange & Act
      renderWithIntl(<VerticalSidebar />);
      const overviewLink = await screen.findByRole("link", {
        name: /overview/i,
      });
      const label = overviewLink.querySelector("span");

      // Assert
      expect(label).toHaveClass("opacity-0", "max-w-0");
      expect(label).toHaveAttribute("aria-hidden", "true");
    });

    it("shows nav label spans when expanded", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);
      await user.click(
        await screen.findByRole("button", { name: /maximize menu/i }),
      );
      const overviewLink = screen.getByRole("link", { name: /overview/i });
      const label = overviewLink.querySelector("span");

      // Assert
      expect(label).toHaveClass("opacity-100", "w-30");
      expect(label).toHaveAttribute("aria-hidden", "false");
    });

    it("uses aria-label on nav links only while collapsed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);
      const overviewLink = await screen.findByRole("link", {
        name: /overview/i,
      });

      // Assert
      expect(overviewLink).toHaveAttribute("aria-label");

      // Act
      await user.click(screen.getByRole("button", { name: /maximize menu/i }));

      // Assert
      expect(
        screen.getByRole("link", { name: /overview/i }),
      ).not.toHaveAttribute("aria-label");
    });

    it("collapses again when Minimize Menu is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);
      await user.click(
        await screen.findByRole("button", { name: /maximize menu/i }),
      );

      // Act
      await user.click(screen.getByRole("button", { name: /minimize menu/i }));

      // Assert
      expect(
        screen.getByRole("button", { name: /maximize menu/i }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("sign out", () => {
    it("calls authService.signOut when Sign out is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);

      // Act
      await user.click(screen.getByRole("button", { name: /sign out/i }));

      // Assert
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });
});
