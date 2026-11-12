import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/front-end/components/recurring/recurring-menu", () => ({
  RecurringMenu: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

import BillsTable from "@/front-end/components/transactions/tables/bills-table";
import { renderWithIntl } from "@/front-end/lib/test-utils/render-with-intl";

const referenceDate = new Date("2024-06-15T12:00:00.000Z");

const transactions = [
  {
    id: "r-1",
    name: "Netflix",
    amount: -15.99,
    date: new Date("2024-06-10T12:00:00.000Z"),
    avatar: "/avatar.png",
  },
  {
    id: "r-2",
    name: "Rent",
    amount: -1200,
    date: new Date("2024-06-20T12:00:00.000Z"),
    avatar: "/avatar2.png",
  },
] as Transaction[];

describe("BillsTable", () => {
  describe("render", () => {
    it("lists recurring bill names", () => {
      // Arrange & Act
      renderWithIntl(
        <BillsTable
          transactions={transactions}
          referenceDate={referenceDate}
        />,
      );

      // Assert
      expect(screen.getByText("Netflix")).toBeInTheDocument();
      expect(screen.getByText("Rent")).toBeInTheDocument();
      expect(
        screen.getByRole("table", { name: /recurring/i }),
      ).toBeInTheDocument();
    });
  });

  describe("menu trigger", () => {
    it("renders an actions control for each bill", () => {
      // Arrange & Act
      renderWithIntl(
        <BillsTable
          transactions={transactions}
          referenceDate={referenceDate}
        />,
      );

      // Assert
      expect(screen.getAllByRole("img", { name: /actions/i }).length).toBe(2);
    });
  });
});
