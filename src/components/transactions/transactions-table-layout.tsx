"use client";

import constants, {
  SortBy,
  TransactionUICategory,
} from "@/services/constants.service";
import { useState } from "react";
import { IPaginationData, ITransactionsTableLayoutProps } from "../types";
import { Transaction } from "@prisma/client";
import { useUpdateEffect } from "react-use";
import transactionService from "@/services/transaction.service";
import { IGetTransactionsParams } from "@/server-actions/types";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import TransactionsTable from "./tables/transactions-table";
import BillsTable from "./tables/bills-table";
import { Select as SelectPrimitive } from "radix-ui";

export default function TransactionsTableLayout({
  transactions = [],
  paginationData,
  category,
  isRecurringOnly,
  referenceDate,
}: ITransactionsTableLayoutProps) {
  const [searchValue, setSearch] = useState("");
  const [searchDBValue, setDBSearch] = useState("");
  const [selectedSortByValue, setSortByValue] = useState<SortBy>(SortBy.Latest);
  const [selectedCategory, setTransactionCategory] =
    useState<TransactionUICategory>(
      category || TransactionUICategory.AllTransactions,
    );
  const [selectedPageNumber, setPageNumber] = useState<number>(
    paginationData?.page || 1,
  );

  const [transactionsItems, setTransactions] =
    useState<Transaction[]>(transactions);
  const [paginationDataItems, setPaginationData] = useState<
    IPaginationData | undefined
  >(paginationData);

  useUpdateEffect(() => {
    updateTransactionsTableLayout({
      page: selectedPageNumber,
      category: selectedCategory,
      sortBy: selectedSortByValue,
      search: searchDBValue,
    });
  }, [
    selectedSortByValue,
    selectedCategory,
    selectedPageNumber,
    searchDBValue,
  ]);

  const handlePaginationPageButtonClick = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const handleSearchChange = (searchVal: string) => {
    setSearch(searchVal);
    const newSearchValue = transactionService.getSearchValue(searchVal);
    // If we have old searchValue that lead to not found transactions result
    // then if new searchVal also has the same symbols that old one
    // we will still get not found result
    // Eventually, no sense to do request to DB with such search
    if (
      transactionService.isNoTransactionsSearchFound(
        searchVal,
        transactionsItems,
      ) &&
      newSearchValue.includes(searchDBValue)
    ) {
      return;
    }
    setDBSearch(newSearchValue);
    setPageNumber(1);
  };

  const handleSortByChange = (value: SortBy) => {
    setSortByValue(value);
  };

  const handleCategoryChange = (value: TransactionUICategory) => {
    setTransactionCategory(value);
  };

  const updateTransactionsTableLayout = async (
    transactionParams: Partial<IGetTransactionsParams>,
  ) => {
    const response = await getTransactionsServerAction({
      ...transactionParams,
      isRecurring: isRecurringOnly,
    });
    let { data: { paginationData, transactions } = {} } = response;
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
      <div className="flex flex-col justify-start gap-6 h-full">
        <div className="flex flex-row gap-3 justify-between items-center">
          <div
            className={cn(
              "relative w-full max-w-sm",
              `${constants.whenLessQueryBreakpoint}:w-auto`,
            )}
          >
            <Input
              autoComplete="off"
              type="search"
              name="search"
              role="search"
              placeholder={
                isRecurringOnly ? "Search Bills" : "Search Transaction"
              }
              aria-label={
                isRecurringOnly ? "Search Bills" : "Search Transaction"
              }
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 pr-10 pl-4"
              tabIndex={0}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <img
                src="/assets/images/icon-search.svg"
                alt="Search"
                className="h-5 w-5"
              />
            </button>
          </div>
          <div
            className={cn(
              "flex flex-row justify-start items-center gap-5",
              `${constants.whenLessQueryBreakpoint}:justify-evenly ${constants.whenLessQueryBreakpoint}:grow-2`,
              isRecurringOnly
                ? `${constants.whenLessQueryBreakpoint}:justify-start`
                : "",
            )}
          >
            <div className="flex flex-row items-center gap-1">
              <Select
                name="sortBy"
                value={selectedSortByValue}
                onValueChange={(value: SortBy) => handleSortByChange(value)}
              >
                <SelectTrigger
                  className={cn(
                    "border-gray-300 w-full",
                    `${constants.whenLessQueryBreakpoint}:hidden`,
                  )}
                >
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectPrimitive.Trigger
                  className={cn(
                    "border-none w-full size-6 outline-none cursor-pointer",
                    `${constants.whenMoreQueryBreakpoint}:hidden`,
                  )}
                >
                  <div className="flex flex-row gap-2">
                    {isRecurringOnly && (
                      <div className="text-app-color whitespace-nowrap text-sm w-fit">
                        Sort By
                      </div>
                    )}
                    <img
                      className="size-6"
                      src="assets/images/icon-sort-mobile.svg"
                    />
                  </div>
                </SelectPrimitive.Trigger>

                {/* position="popper" align="end" */}
                <SelectContent>
                  {Object.entries(SortBy).map(([name, value]) => (
                    <SelectItem key={name} value={value}>
                      <span>{value}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isRecurringOnly && (
              <div className="flex flex-row items-center gap-1">
                <Select
                  name="category"
                  value={selectedCategory}
                  onValueChange={(value: TransactionUICategory) =>
                    handleCategoryChange(value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "border-gray-300 w-full min-w-40",
                      `${constants.whenLessQueryBreakpoint}:hidden`,
                    )}
                  >
                    <SelectValue placeholder="Transaction category" />
                  </SelectTrigger>
                  <SelectPrimitive.Trigger
                    className={cn(
                      "border-none w-full size-6 outline-none cursor-pointer",
                      `${constants.whenMoreQueryBreakpoint}:hidden`,
                    )}
                  >
                    <img
                      className="size-6"
                      src="assets/images/icon-filter-mobile.svg"
                    />
                  </SelectPrimitive.Trigger>

                  <SelectContent>
                    {Object.entries(TransactionUICategory).map(
                      ([name, value]) => (
                        <SelectItem key={name} value={value}>
                          <span>{value}</span>
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto h-full">
          {transactionService.isNoTransactionsSearchFound(
            searchValue,
            transactionsItems,
          ) ? (
            <div className="flex justify-center items-center h-full">
              {isRecurringOnly ? "No Bills Found" : "No Transactions Found"}
            </div>
          ) : !isRecurringOnly ? (
            <TransactionsTable transactions={transactionsItems} />
          ) : (
            <BillsTable
              transactions={transactionsItems}
              referenceDate={referenceDate}
            />
          )}
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
                  onClick={() => handlePaginationPageButtonClick(pageNumber)}
                  className={cn(
                    "flex items-center justify-center cursor-pointer border-2 min-w-7 h-8 rounded-[8px] text-app-color transition-colors shrink-0",
                    isCurrentPage
                      ? "bg-black text-white border-transparent"
                      : "hover:bg-gray-100 border-gray-300",
                    selectedPageNumber === 1 && totalPages === 1
                      ? "invisible"
                      : "",
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
    </>
  );
}
