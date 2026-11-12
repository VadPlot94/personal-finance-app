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
        expect(
          screen.getByRole("link", { name: /overview/i }),
        ).toHaveAttribute("aria-current", "page");
      });
    });
  });

  describe("menu toggle", () => {
    it("expands and collapses the menu labels", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<VerticalSidebar />);
      const toggle = await screen.findByRole("button", {
        name: /maximize menu/i,
      });

      // Assert
      expect(toggle).toHaveAttribute("aria-expanded", "false");

      // Act
      await user.click(toggle);

      // Assert
      expect(
        screen.getByRole("button", { name: /minimize menu/i }),
      ).toHaveAttribute("aria-expanded", "true");
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
