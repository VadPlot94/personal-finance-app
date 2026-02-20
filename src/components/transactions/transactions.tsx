"use client";

import { useState } from "react";
import { IPaginationData, ITransactionsProps } from "../types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SortBy, TransactionCategory } from "@/services/constants.service";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";
import { Transaction } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import transactionService from "@/services/transaction.service";

export default function Transactions({
  transactions = [],
  paginationData,
}: ITransactionsProps) {
  const [query, setQuery] = useState("");
  const [sortByValue, setSortByValue] = useState<SortBy>(SortBy.Latest);
  const [transactionCategoryValue, setTransactionCategory] =
    useState<TransactionCategory>(TransactionCategory.AllTransactions);
  const [transactionsItems, setTransactions] =
    useState<Transaction[]>(transactions);
  const [paginationDataItems, setPaginationData] = useState<
    IPaginationData | undefined
  >(paginationData);
  const [selectedPageNumber, setPageNumber] = useState<number>(
    paginationData?.page || 1,
  );

  const handleSearch = () => {
    transactionsItems.filter((t) => t.name);
  };

  const handlePaginationPageButtonClick = async (pageNumber: number) => {
    if (selectedPageNumber === pageNumber) {
      return;
    }
    const response = await getTransactionsServerAction({ page: pageNumber });
    const { data: { paginationData, transactions } = {} } = response;
    if (!response?.success || !transactions) {
      let error = response.error;
      error =
        response?.success && !transactions?.length
          ? "Error: No new transactions got"
          : error;
      toast.error("Error", {
        description: error || "ERROR",
      });
      return;
    }
    setTransactions(transactions);
    setPaginationData(paginationData);
    setPageNumber(pageNumber);
  };

  const handlePrevButtonClick = () => {
    if (selectedPageNumber > 1) {
      handlePaginationPageButtonClick(selectedPageNumber - 1);
    }
  };

  const handleNextButtonClick = (totalPages: number) => {
    if (selectedPageNumber < totalPages) {
      handlePaginationPageButtonClick(selectedPageNumber + 1);
    }
  };

  const totalPages =
    transactionService.getPaginationPagesNumber(paginationDataItems);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-bold text-3xl">Transactions</div>
      </div>
      {transactions?.length ? (
        <div className="flex flex-col justify-between w-full h-full rounded-lg p-5 bg-white shadow-sm gap-6">
          <div className="flex flex-col justify-start gap-6">
            <div className="flex flex-row justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Input
                  autoComplete="off"
                  type="search"
                  name="search"
                  role="search"
                  placeholder="Search Transaction"
                  aria-label="Search Transaction"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-10 pr-10 pl-4"
                  tabIndex={0}
                />
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <img
                    src="/assets/images/icon-search.svg"
                    alt="Search"
                    className="h-5 w-5"
                  />
                </button>
              </div>
              <div className="flex flex-row justify-start items-center gap-5">
                <div>
                  <Select
                    name="sortBy"
                    value={sortByValue}
                    onValueChange={(value) => setSortByValue(value as SortBy)}
                  >
                    <SelectTrigger className="border-gray-300 w-full">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.entries(SortBy).map(([name, value]) => (
                        <SelectItem key={name} value={value}>
                          <span>{value}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    name="category"
                    value={transactionCategoryValue}
                    onValueChange={(value) =>
                      setTransactionCategory(value as TransactionCategory)
                    }
                  >
                    <SelectTrigger className="border-gray-300 w-full min-w-40">
                      <SelectValue placeholder="Transaction category" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.entries(TransactionCategory).map(
                        ([name, value]) => (
                          <SelectItem key={name} value={value}>
                            <span>{value}</span>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 cursor-default">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 w-[40%] text-left text-xs text-app-color tracking-wider"
                    >
                      Recipient/Sender
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-xs text-app-color tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-left text-xs text-app-color tracking-wider"
                    >
                      Transaction Date
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-right text-xs text-app-color tracking-wider"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {transactionsItems.map((tx) => (
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
                      <td className="py-4 px-6 text-app-color w-25">
                        {tx.category}
                      </td>
                      <td className="py-4 whitespace-nowrap text-app-color w-30">
                        {new Date(tx.date).toLocaleDateString("en-Us", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 whitespace-nowrap font-bold text-right">
                        <span
                          className={
                            tx.amount > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {tx.amount > 0 ? "+" : "-"}$
                          {Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr_auto] items-center w-full gap-10">
            <div className="justify-self-start">
              <button
                onClick={() => handlePrevButtonClick()}
                className={cn(
                  "flex items-center justify-center cursor-pointer text-app-color border-2 w-10 h-8 rounded-[10px] hover:bg-gray-100 border-gray-300",
                  selectedPageNumber <= 1
                    ? "bg-gray-300 hover:bg-gray-300 cursor-default"
                    : "",
                )}
              >
                <img
                  className="text-app-color size-4"
                  src="assets/images/icon-caret-left.svg"
                />
              </button>
            </div>
            <div className="justify-self-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              <div className="flex flex-row items-center justify-center gap-2 min-w-max px-2 py-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = selectedPageNumber === pageNumber;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() =>
                        handlePaginationPageButtonClick(pageNumber)
                      }
                      className={cn(
                        "flex items-center justify-center cursor-pointer border-2 min-w-7 h-8 rounded-[8px] text-app-color transition-colors flex-shrink-0",
                        isCurrentPage
                          ? "bg-black text-white border-transparent"
                          : "hover:bg-gray-100 border-gray-300",
                      )}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="justify-self-end">
              <button
                onClick={() => handleNextButtonClick(totalPages)}
                className={cn(
                  "flex items-center justify-center cursor-pointer text-app-color border-2 w-10 h-8 rounded-[10px] hover:bg-gray-100 border-gray-300",
                  selectedPageNumber >= totalPages
                    ? "bg-gray-300 hover:bg-gray-300 cursor-default"
                    : "",
                )}
              >
                <img
                  className="text-app-color size-4"
                  src="assets/images/icon-caret-right.svg"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center text-app-color">
          <p className="font-semibold">No transactions are available.</p>
          <p>
            Click{" "}
            <span className="font-semibold">&nbsp;'Add Transaction'&nbsp;</span>{" "}
            button at the corner of the page to create it.
          </p>
        </div>
      )}
    </>
  );
}
