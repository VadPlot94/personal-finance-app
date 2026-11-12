import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Pot } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const forceGridAnimationMock = vi.fn();

vi.mock("animate-css-grid", () => ({
  wrapGrid: () => ({
    forceGridAnimation: forceGridAnimationMock,
  }),
}));

vi.mock("@/front-end/components/pots/dialogs/edit-pot-dialog", () => ({
  EditPotDialog: ({ isDialogOpen }: { isDialogOpen: boolean }) =>
    isDialogOpen ? <div role="dialog">Add pot dialog</div> : null,
}));

vi.mock("@/front-end/components/pots/pots-item", () => ({
  default: ({ pot }: { pot: Pot }) => <div>{pot.name}</div>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/back-end/server-actions/locale-actions", () => ({
  setLocaleSRF: vi.fn(),
}));

import Pots from "@/front-end/components/pots/pots";
import { installResizeObserverMock } from "@/front-end/lib/test-utils/resize-observer.mock";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants, { Theme } from "@/shared/services/constants.service";

const pots = [
  {
    id: "p-1",
    name: "Vacation",
    total: 50,
    target: 100,
    theme: Theme.Green,
  },
  {
    id: "p-2",
    name: "New laptop",
    total: 20,
    target: 200,
    theme: Theme.Green,
  },
] as Pot[];

describe("Pots", () => {
  let resizeControl: ReturnType<typeof installResizeObserverMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    resizeControl = installResizeObserverMock();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("render", () => {
    it("lists pot cards", () => {
      // Arrange & Act
      renderWithIntl(<Pots pots={pots} availableBalance={500} />);

      // Assert
      expect(screen.getByText("Vacation")).toBeInTheDocument();
      expect(screen.getByText("New laptop")).toBeInTheDocument();
    });

    it("shows empty state when there are no pots", () => {
      // Arrange & Act
      renderWithIntl(<Pots pots={[]} availableBalance={500} />);

      // Assert
      expect(screen.queryByText("Vacation")).not.toBeInTheDocument();
    });
  });

  describe("add pot", () => {
    it("opens the add-pot dialog from the page header", async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithIntl(<Pots pots={pots} availableBalance={500} />);

      // Act
      await user.click(screen.getByRole("button", { name: /add new pot/i }));

      // Assert
      expect(screen.getByRole("dialog")).toHaveTextContent(/add pot/i);
    });
  });

  describe("resize", () => {
    it("forces grid animation when container crosses the breakpoint", () => {
      // Arrange
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return constants.ContainerQueryBreakpoint + 100;
        },
      });
      renderWithIntl(<Pots pots={pots} availableBalance={500} />);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      forceGridAnimationMock.mockClear();

      // Act — cross below breakpoint
      act(() => {
        resizeControl.trigger(constants.ContainerQueryBreakpoint - 50);
      });

      // Assert
      expect(forceGridAnimationMock).toHaveBeenCalled();
    });
  });
});
