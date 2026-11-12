import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const refreshMock = vi.fn();
const setLocaleSRFMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: (...args: unknown[]) => setLocaleSRFMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

import LocaleSwitcher from "@/front-end/components/locale-switcher/locale-switcher";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("render", () => {
    it("shows the language combobox", () => {
      // Arrange & Act
      renderWithIntl(<LocaleSwitcher />);

      // Assert
      expect(
        screen.getByRole("combobox", { name: /language/i }),
      ).toBeInTheDocument();
    });
  });

  describe("locale change", () => {
    it("persists the locale and refreshes the router", async () => {
      // Arrange
      const user = userEvent.setup();
      setLocaleSRFMock.mockResolvedValue(true);
      renderWithIntl(<LocaleSwitcher />);
      const trigger = screen.getByRole("combobox", { name: /language/i });

      // Act
      await user.click(trigger);
      const option = await screen.findByRole("option", { name: "RU" });
      await user.click(option);

      // Assert
      expect(setLocaleSRFMock).toHaveBeenCalledWith("ru-RU");
      expect(refreshMock).toHaveBeenCalled();
    });

    it("shows an error toast when locale persistence fails", async () => {
      // Arrange
      const user = userEvent.setup();
      setLocaleSRFMock.mockResolvedValue(false);
      renderWithIntl(<LocaleSwitcher />);
      const trigger = screen.getByRole("combobox", { name: /language/i });

      // Act
      await user.click(trigger);
      const option = await screen.findByRole("option", { name: "RU" });
      await user.click(option);

      // Assert
      expect(toastErrorMock).toHaveBeenCalled();
      expect(refreshMock).not.toHaveBeenCalled();
    });
  });
});
