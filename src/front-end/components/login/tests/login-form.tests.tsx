import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useSessionMock = vi.fn();
const signInMock = vi.fn();
const pushMock = vi.fn();
const registerUserSRFMock = vi.fn();
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
  signIn: (...args: unknown[]) => signInMock(...args),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
}));

vi.mock("@/back-end/server-actions/auth-actions", () => ({
  registerUserSRF: (...args: unknown[]) => registerUserSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}));

import LoginForm from "@/front-end/components/login/login-form";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import { AuthMode } from "@/shared/services/constants.service";
import constants from "@/shared/services/constants.service";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  describe("tabs", () => {
    it("starts on the sign-in tab by default", () => {
      // Arrange & Act
      renderWithIntl(<LoginForm />);

      // Assert
      expect(screen.getByRole("tab", { name: /sign in/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it("switches to the register tab when selected", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<LoginForm />);

      // Act
      await user.click(screen.getByRole("tab", { name: /register/i }));

      // Assert
      expect(screen.getByRole("tab", { name: /register/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it("opens on register when authMode is Register", () => {
      // Arrange & Act
      renderWithIntl(<LoginForm authMode={AuthMode.Register} />);

      // Assert
      expect(screen.getByRole("tab", { name: /register/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  describe("sign-in", () => {
    it("keeps submit disabled until email and password are valid", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<LoginForm />);
      const submit = screen.getByRole("button", { name: /^sign in$/i });

      // Assert
      expect(submit).toBeDisabled();

      // Act
      await user.type(screen.getByLabelText(/email/i), "user@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "secret12");

      // Assert
      await waitFor(() => {
        expect(submit).toBeEnabled();
      });
    });

    it("signs in with credentials and navigates to overview", async () => {
      // Arrange
      const user = userEvent.setup();
      signInMock.mockResolvedValue({ error: null });
      renderWithIntl(<LoginForm />);
      await user.type(screen.getByLabelText(/email/i), "user@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "secret12");

      // Act
      await user.click(screen.getByRole("button", { name: /^sign in$/i }));

      // Assert
      await waitFor(() => {
        expect(signInMock).toHaveBeenCalledWith(
          "credentials",
          expect.objectContaining({
            email: "user@example.com",
            password: "secret12",
            redirect: false,
          }),
        );
      });
      expect(pushMock).toHaveBeenCalledWith(constants.AppRoutes.overview);
    });

    it("shows invalid credentials when sign-in fails", async () => {
      // Arrange
      const user = userEvent.setup();
      signInMock.mockResolvedValue({ error: "CredentialsSignin" });
      renderWithIntl(<LoginForm />);
      await user.type(screen.getByLabelText(/email/i), "user@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "secret12");

      // Act
      await user.click(screen.getByRole("button", { name: /^sign in$/i }));

      // Assert
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(pushMock).not.toHaveBeenCalled();
    });

    it("starts Google OAuth when Continue with Google is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithIntl(<LoginForm />);

      // Act
      await user.click(
        screen.getByRole("button", { name: /continue with google|gmail/i }),
      );

      // Assert
      expect(signInMock).toHaveBeenCalledWith(
        "google",
        expect.objectContaining({ redirect: true }),
      );
    });
  });

  describe("already signed in", () => {
    it("redirects to overview when a session already exists", async () => {
      // Arrange
      useSessionMock.mockReturnValue({
        data: { user: { id: "user-1" } },
        status: "authenticated",
      });

      // Act
      renderWithIntl(<LoginForm />);

      // Assert
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith(constants.AppRoutes.overview);
      });
    });
  });
});
