"use client";

import EmptyContentWrapper from "../empty-content-wrapper/empty-content-wrapper";
import TileHeader from "../tile-header/tile-header";
import { ITransactionsTileProps } from "../types";
import transactionService from "@/services/transaction.service";
import { cn } from "@/lib/utils";
import { TransactionUICategory } from "@/services/constants.service";

export default function TransactionsTile({
  transactions = [],
  isBudgetTile = false,
  category,
}: ITransactionsTileProps) {
  const categoryQueryParam =
    category === TransactionUICategory.AllTransactions ? null : category;
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 rounded-lg p-5 bg-white shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]",
        isBudgetTile && "bg-app-background shadow-none hover:shadow-none",
      )}
    >
      <TileHeader
        title={isBudgetTile ? "Latest Spending" : "Transactions"}
        href={`/transactions${categoryQueryParam ? `?category=${encodeURIComponent(categoryQueryParam)}` : ""}`}
        linkLabel={isBudgetTile ? "See all" : "View All"}
      />
      <EmptyContentWrapper
        hasItems={!!transactions?.length}
        emptyTitle="No transactions are available."
      >
        <div className="flex flex-row justify-between h-full gap-5">
          <div className="h-full flex-1 min-w-0">
            <table className="min-w-full divide-y divide-gray-200 cursor-default">
              <tbody
                className={`divide-y ${isBudgetTile ? "divide-y-2 divide-dotted divide-gray-500" : "divide-gray-200"}`}
              >
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-4 max-mobileXS:max-w-30">
                        <img
                          src={tx.avatar as string}
                          alt={tx.name}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                        />
                        <div className="font-bold truncate">{tx.name}</div>
                      </div>
                    </td>
                    <td className="flex flex-col py-4 whitespace-nowrap text-right">
                      <span
                        className={cn(
                          "font-bold",
                          tx.amount > 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {transactionService.getTransactionAmount(tx.amount)}
                      </span>
                      <span className="whitespace-nowrap text-app-color text-xs">
                        {transactionService.getTransactionDate(tx.date)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </EmptyContentWrapper>
    </div>
  );
}
