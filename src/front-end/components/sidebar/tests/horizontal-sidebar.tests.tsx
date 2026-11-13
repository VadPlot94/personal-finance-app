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

import HorizontalSidebar from "@/front-end/components/sidebar/horizontal-sidebar";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants from "@/shared/services/constants.service";

describe("HorizontalSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePathnameMock.mockReturnValue(constants.AppRoutes.budgets);
    useSessionMock.mockReturnValue({
      data: { user: { id: "user-1", name: "Ada Lovelace", image: null } },
      status: "authenticated",
    });
  });

  describe("navigation", () => {
    it("marks the active route after mount", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /budgets/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders the account item as non-interactive", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /^Ada$/i })).toHaveAttribute(
          "tabindex",
          "-1",
        );
      });
    });
  });

  describe("sign out", () => {
    it("prevents navigation and signs out", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<HorizontalSidebar />);
      const signOutLink = await screen.findByRole("link", {
        name: /sign out/i,
      });

      // Act
      await user.click(signOutLink);

      // Assert
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("label visibility classes (sm breakpoint)", () => {
    it("hides label text below sm via max-sm utility classes", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);
      const budgetsLink = await screen.findByRole("link", {
        name: /budgets/i,
      });
      const label = budgetsLink.querySelector("span");

      // Assert
      expect(label).toHaveClass("max-sm:opacity-0", "max-sm:h-0");
    });

    it("shows label text from sm and up via sm utility class", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);
      const budgetsLink = await screen.findByRole("link", {
        name: /budgets/i,
      });
      const label = budgetsLink.querySelector("span");

      // Assert
      expect(label).toHaveClass("sm:opacity-100");
    });

    it("renders nav item titles in the label spans", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);
      const budgetsLink = await screen.findByRole("link", {
        name: /budgets/i,
      });

      // Assert
      expect(budgetsLink.querySelector("span")).toHaveTextContent(/budgets/i);
    });

    it("tightens item gap below sm", async () => {
      // Arrange & Act
      renderWithIntl(<HorizontalSidebar />);
      const budgetsLink = await screen.findByRole("link", {
        name: /budgets/i,
      });

      // Assert
      expect(budgetsLink).toHaveClass("max-sm:gap-0");
    });
  });
});
