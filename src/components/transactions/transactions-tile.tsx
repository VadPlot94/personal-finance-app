"use client";
import Link from "next/link";
import { ITransactionsTileProps } from "../types";
import transactionService from "@/services/transaction.service";
import { cn } from "@/lib/utils";

export default function TransactionsTile({
  transactions = [],
}: ITransactionsTileProps) {
  return (
    <div className="flex flex-col justify-between gap-5 h-full rounded-lg p-5 bg-white shadow-sm min-w-127.5">
      <div className="flex flex-row justify-between items-center">
        <div className="font-bold text-[20px]">Transactions</div>
        <Link
          href="/transactions"
          className="flex flex-row gap-1 text-app-color text-sm"
        >
          <span className="font-weight w-15">View all</span>
          <img src="assets/images/icon-caret-right.svg" />
        </Link>
      </div>
      <div className="flex flex-row justify-between h-full gap-5">
        <div className="h-full flex-1 min-w-0">
          <table className="min-w-full divide-y divide-gray-200 cursor-default">
            <tbody className="divide-y divide-gray-200 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
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
    </div>
  );
}
