import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useSessionMock = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

import CreateAccountLink from "@/front-end/components/create-account-link";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants, { AuthMode } from "@/shared/services/constants.service";

describe("CreateAccountLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signed out", () => {
    it("links to register auth mode", () => {
      // Arrange
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      // Act
      renderWithIntl(<CreateAccountLink />);

      // Assert
      expect(
        screen.getByRole("link", { name: /create account/i }),
      ).toHaveAttribute(
        "href",
        `${constants.AppRoutes.login}?authMode=${AuthMode.Register}`,
      );
    });
  });

  describe("signed in", () => {
    it("disables account creation when already signed in", () => {
      // Arrange
      useSessionMock.mockReturnValue({
        data: { user: { id: "user-1" } },
        status: "authenticated",
      });

      // Act
      renderWithIntl(<CreateAccountLink />);

      // Assert
      expect(
        screen.queryByRole("link", { name: /create account/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByText(/create account/i)).toHaveAttribute(
        "title",
        expect.stringMatching(/already/i),
      );
    });
  });
});
