"use client";

import { ITransactionsTableProps } from "@/components/types";
import { cn } from "@/lib/utils";
import transactionService from "@/services/transaction.service";

export default function TransactionsTable({
  transactions,
}: ITransactionsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 cursor-default font-size">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3 px-3 w-[40%] text-left text-xs text-app-color tracking-wider"
          >
            Recipient/Sender
          </th>
          <th
            scope="col"
            className={cn(
              "py-3 px-6 text-left text-xs text-app-color tracking-wider",
              "@max-containerQueryBreakpoint820/mainLayout:hidden",
            )}
          >
            Category
          </th>
          <th
            scope="col"
            className={cn(
              "py-3 text-left text-xs text-app-color tracking-wider",
              "@max-containerQueryBreakpoint820/mainLayout:hidden",
            )}
          >
            Transaction Date
          </th>
          <th
            scope="col"
            className="py-3 px-3 text-right text-xs text-app-color tracking-wider"
          >
            Amount
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 text-sm">
        {transactions.map((tx) => (
          <tr key={tx.id} className="hover:bg-gray-50 transition">
            <td className="max-sm:w-[60%] min-w-0">
              <div className="py-4 ml-3 flex flex-row items-center gap-4 min-w-0 max-mobileXS:max-w-30">
                <img
                  src={tx.avatar as string}
                  alt={tx.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex flex-col min-w-0">
                  <div className="font-bold truncate">{tx.name}</div>

                  <span
                    className={cn(
                      "whitespace-nowrap text-app-color text-xs",
                      "@containerQueryBreakpoint820/mainLayout:hidden",
                    )}
                  >
                    {tx.category}
                  </span>
                </div>
              </div>
            </td>

            <td
              className={cn(
                "py-4 px-6 text-app-color w-30 whitespace-nowrap",
                "@max-containerQueryBreakpoint820/mainLayout:hidden",
              )}
            >
              {tx.category}
            </td>

            <td
              className={cn(
                "py-4 text-app-color w-30 whitespace-nowrap",
                "@max-containerQueryBreakpoint820/mainLayout:hidden",
              )}
            >
              {transactionService.getTransactionDate(tx.date)}
            </td>

            <td className="flex flex-col h-full items-end justify-center gap-1 min-h-[64px]">
              <div className="flex flex-row gap-1">
                {tx.recurring && (
                  <img
                    className="w-5 h-5"
                    src="assets/images/recurring-subscription-icon.svg"
                    alt="Recurring"
                    title="Recurring"
                  />
                )}
                <span
                  className={cn(
                    "font-bold",
                    tx.amount > 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {transactionService.getTransactionAmount(tx.amount)}
                </span>
              </div>

              <span
                className={cn(
                  "whitespace-nowrap text-app-color text-xs",
                  "@containerQueryBreakpoint820/mainLayout:hidden",
                )}
              >
                {transactionService.getTransactionDate(tx.date)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
