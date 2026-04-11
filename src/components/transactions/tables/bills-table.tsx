"use client";

import recurringService, {
  RecurringStatus,
} from "@/services/recurring.service";
import transactionService from "@/services/transaction.service";
import { cn } from "@/lib/utils";
import constants from "@/services/constants.service";
import { RecurringMenu } from "@/components/recurring/recurring-menu";
import { IBillsTableProps } from "@/components/types";
import { Transaction } from "@prisma/client";

export default function BillsTable({
  transactions,
  referenceDate,
}: IBillsTableProps) {
  const getTimeCell = (status: RecurringStatus, tx: Transaction) => (
    <div
      className={cn("py-4 max-w-35 min-w-0 text-green-800 truncate")}
      title={status}
    >
      {recurringService.getRecurringDueDateString(tx.date)}

      {status === RecurringStatus.Paid && (
        <img
          src="assets/images/icon-bill-paid.svg"
          alt="Paid"
          className="h-4 w-4"
        />
      )}
      {status === RecurringStatus.DueSoon && (
        <img
          src="assets/images/icon-bill-due.svg"
          alt="Due Soon"
          className="h-4 w-4"
        />
      )}
    </div>
  );

  return (
    <table className="min-w-full divide-y divide-gray-200 cursor-default font-size">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3 px-3 w-[40%] text-left text-xs text-app-color tracking-wider"
          >
            Bill Title
          </th>
          <th
            scope="col"
            className={cn(
              "py-3 text-left text-xs text-app-color tracking-wider",
              "@max-containerQueryBreakpoint820/mainLayout:hidden",
            )}
          >
            Due Date
          </th>
          <th scope="col" className="text-xs text-app-color text-right">
            Amount
          </th>
          <th className="py-3 px-3 text-right text-xs text-app-color tracking-wider"></th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 text-sm">
        {transactions.map((tx) => {
          const status = recurringService.getTransactionStatus(
            tx,
            referenceDate,
            constants.RecurringDueSoonDays,
          );

          return (
            <tr key={tx.id} className="hover:bg-gray-50 transition">
              <td className="max-sm:w-[50%] min-w-0">
                <div className="py-4 ml-3 flex flex-row items-center gap-4 min-w-0 max-mobileXS:max-w-30">
                  <img
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                    src={tx.avatar as string}
                    alt={tx.name}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="font-bold @max-containerQueryBreakpoint820/mainLayout:truncate">
                      {tx.name}
                    </div>
                    <span
                      className={cn(
                        "text-app-color text-xs",
                        "@containerQueryBreakpoint820/mainLayout:hidden",
                      )}
                    >
                      {getTimeCell(status, tx)}
                    </span>
                  </div>
                </div>
              </td>

              <td className="@max-containerQueryBreakpoint820/mainLayout:hidden">
                {getTimeCell(status, tx)}
              </td>

              <td className="py-4 whitespace-nowrap font-bold text-right">
                <span
                  className={tx.amount > 0 ? "text-green-600" : "text-red-600"}
                >
                  {transactionService.getTransactionAmount(tx.amount)}
                </span>
              </td>

              <td className="py-6 whitespace-nowrap font-bold text-right px-3">
                <div className="flex items-center justify-end gap-1 cursor-pointer">
                  <RecurringMenu recurringTransaction={tx}>
                    <img
                      className="w-5 h-5"
                      src="assets/images/icon-ellipsis.svg"
                      alt="Actions"
                    />
                  </RecurringMenu>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
