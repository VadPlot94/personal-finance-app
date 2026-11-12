import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useSessionMock = vi.fn();
const signOutMock = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

import SignInButton from "@/front-end/components/sign-in-button/sign-in-button";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants from "@/shared/services/constants.service";

describe("SignInButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading session", () => {
    it("renders nothing while the session is loading", () => {
      // Arrange
      useSessionMock.mockReturnValue({ data: null, status: "loading" });

      // Act
      const { container } = renderWithIntl(<SignInButton />);

      // Assert
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("signed out", () => {
    it("links to the login page", () => {
      // Arrange
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      // Act
      renderWithIntl(<SignInButton />);

      // Assert
      expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
        "href",
        constants.AppRoutes.login,
      );
    });
  });

  describe("signed in", () => {
    it("signs the user out when clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      useSessionMock.mockReturnValue({
        data: { user: { id: "user-1" } },
        status: "authenticated",
      });
      renderWithIntl(<SignInButton />);

      // Act
      await user.click(screen.getByRole("button", { name: /sign out/i }));

      // Assert
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });
});
