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
              "@max-[580px]:hidden",
            )}
          >
            Category
          </th>
          <th
            scope="col"
            className={cn(
              "py-3 text-left text-xs text-app-color tracking-wider",
              "@max-[580px]:hidden",
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
            <td className="py-4 px-3">
              <div className="flex flex-row items-center gap-4">
                <img
                  src={tx.avatar as string}
                  alt={tx.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex flex-col">
                  <div className="font-bold truncate">{tx.name}</div>

                  <span
                    className={cn(
                      "whitespace-nowrap text-app-color text-xs",
                      "@[580px]:hidden",
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
                "@max-[580px]:hidden",
              )}
            >
              {tx.category}
            </td>

            <td
              className={cn(
                "py-4 text-app-color w-30 whitespace-nowrap",
                "@max-[580px]:hidden",
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
                  "@[580px]:hidden",
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
