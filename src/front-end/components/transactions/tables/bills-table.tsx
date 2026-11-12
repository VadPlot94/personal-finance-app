"use client";

import type { Transaction } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { RecurringMenu } from "@/front-end/components/recurring/recurring-menu";
import type { IBillsTableProps } from "@/front-end/components/transactions/types";
import recurringService, {
  RecurringStatus,
} from "@/front-end/services/recurring.service";
import transactionService from "@/front-end/services/transaction.service";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export default function BillsTable({
  transactions,
  referenceDate,
}: IBillsTableProps) {
  const t = useTranslations();
  const locale = useLocale();

  const getDueDateLabel = (date: Date | string) =>
    recurringService.getRecurringDueDateString(
      date,
      locale,
      ({ monthName, day, suffix }) =>
        t("i18n.RecurringPage.DueDateFormat", { monthName, day, suffix }),
    );

  const getTimeCell = (status: RecurringStatus, tx: Transaction) => (
    <div
      className="py-4 min-w-0 text-green-800 flex flex-row items-center gap-1"
      title={t(`i18n.Enums.RecurringStatus.${status}`)}
    >
      <span className="truncate min-w-0">{getDueDateLabel(tx.date)}</span>
      {status === RecurringStatus.Paid && (
        <img
          src="assets/images/icon-bill-paid.svg"
          alt={t("i18n.RecurringPage.Paid")}
          className="h-4 w-4 shrink-0"
        />
      )}
      {status === RecurringStatus.DueSoon && (
        <img
          src="assets/images/icon-bill-due.svg"
          alt={t("i18n.RecurringPage.DueSoonAlt")}
          className="h-4 w-4 shrink-0"
        />
      )}
    </div>
  );

  return (
    <table
      className="min-w-full divide-y divide-gray-200 cursor-default font-size"
      aria-label={t("i18n.RecurringPage.Title")}
    >
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3 px-3 w-[40%] text-left text-xs text-app-color tracking-wider"
          >
            {t("i18n.RecurringPage.BillTitle")}
          </th>
          <th
            scope="col"
            className={cn(
              "py-3 text-left text-xs text-app-color tracking-wider",
              "@max-containerQueryBreakpoint820/mainLayout:hidden",
            )}
          >
            {t("i18n.RecurringPage.DueDate")}
          </th>
          <th scope="col" className="text-xs text-app-color text-right">
            {t("i18n.TransactionsPage.Amount")}
          </th>
          <th
            scope="col"
            className="py-3 px-3 text-right text-xs text-app-color tracking-wider"
            aria-label={t("i18n.Common.Actions")}
          />
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
                      alt={t("i18n.Common.Actions")}
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
