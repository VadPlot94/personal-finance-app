import type { Budget } from "@prisma/client";
import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import BudgetDonutChart from "@/front-end/components/budgets/budget-donut-chart";
import { installMatchMediaMock } from "@/front-end/lib/test-utils/match-media.mock";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";
import constants, {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

const budgets = [
  {
    id: "b-1",
    category: TransactionUICategory.Entertainment,
    maximum: 100,
    theme: Theme.Green,
  },
] as Budget[];

const transactionsByCategoryList = [
  {
    category: TransactionUICategory.Entertainment,
    transactions: [{ amount: -40 } as never],
  },
];

describe("BudgetDonutChart", () => {
  afterEach(() => {
    installMatchMediaMock(true);
  });

  describe("render", () => {
    it("shows spent and limit totals", () => {
      // Arrange
      installMatchMediaMock(false);

      // Act
      renderWithIntl(
        <BudgetDonutChart
          budgets={budgets}
          size={300}
          transactionsByCategoryList={transactionsByCategoryList}
        />,
      );

      // Assert
      expect(screen.getByText("$40")).toBeInTheDocument();
      expect(screen.getByText(/of \$100 Limit/i)).toBeInTheDocument();
    });
  });

  describe("resize", () => {
    it("uses the default donut size on x-small viewports", () => {
      // Arrange
      installMatchMediaMock(true);

      // Act
      const { container } = renderWithIntl(
        <BudgetDonutChart
          budgets={budgets}
          size={300}
          transactionsByCategoryList={transactionsByCategoryList}
        />,
      );
      const donut = container.querySelector(".rounded-full") as HTMLElement;

      // Assert
      expect(donut.style.width).toBe(`${constants.DefaultDonutChartSize}px`);
    });

    it("switches to the requested size when the viewport grows", () => {
      // Arrange
      const media = installMatchMediaMock(true);
      const { container } = renderWithIntl(
        <BudgetDonutChart
          budgets={budgets}
          size={300}
          transactionsByCategoryList={transactionsByCategoryList}
        />,
      );
      const donut = container.querySelector(".rounded-full") as HTMLElement;

      // Act
      act(() => {
        media.setMatches(false);
        window.dispatchEvent(new Event("resize"));
      });

      // Assert
      expect(donut.style.width).toBe("300px");
    });
  });
});
