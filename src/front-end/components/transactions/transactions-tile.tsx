"use client";

import { useLocale, useTranslations } from "next-intl";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import type { ITransactionsTileProps } from "@/front-end/components/transactions/types";
import transactionService from "@/front-end/services/transaction.service";
import { cn } from "@/lib/utils";
import constants, {
  TransactionUICategory,
} from "@/shared/services/constants.service";

function buildTransactionsHref(category?: TransactionUICategory): string {
  const categoryQueryParam =
    category === TransactionUICategory.AllTransactions ? null : category;
  return `${constants.AppRoutes.transactions}${categoryQueryParam ? `?category=${encodeURIComponent(categoryQueryParam)}` : ""}`;
}

export default function TransactionsTile({
  transactions = [],
  isBudgetTile = false,
  category,
}: ITransactionsTileProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <ItemCard
      className={cn(
        isBudgetTile && "bg-app-background shadow-none hover:shadow-none",
      )}
    >
      <TileHeader
        title={
          isBudgetTile
            ? t("i18n.TransactionsPage.LatestSpending")
            : t("i18n.TransactionsPage.Title")
        }
        href={buildTransactionsHref(category)}
        linkLabel={
          isBudgetTile ? t("i18n.Common.SeeAll") : t("i18n.Common.ViewAll")
        }
      />
      <EmptyContentWrapper
        hasItems={!!transactions?.length}
        emptyTitle={t("i18n.TransactionsPage.EmptyTitle")}
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
                      <div className="flex flex-row items-center gap-4 max-mobileXS:max-w-30">
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
                        {transactionService.getTransactionDate(tx.date, locale)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </EmptyContentWrapper>
    </ItemCard>
  );
}
