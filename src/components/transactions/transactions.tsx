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
import { SortBy, TransactionUICategory } from "@/services/constants.service";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";
import { Transaction } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import transactionService from "@/services/transaction.service";
import { IGetTransactionsParams } from "@/server-actions/types";
import { useUpdateEffect } from "react-use";
import PageContentHeader from "../page-content-header/page-content-header";

export default function Transactions({
  transactions = [],
  paginationData,
  category,
}: ITransactionsProps) {
  const [isAddTransactionDialogOpen, setAddTransactionDialogOpen] =
    useState(false);

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
    updateTransactionsTable({
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

  const updateTransactionsTable = async (
    transactionParams: Partial<IGetTransactionsParams>,
  ) => {
    const response = await getTransactionsServerAction(transactionParams);
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
      <PageContentHeader
        name="Transactions"
        buttonName="Add Transaction"
        handleButtonClick={() => setAddTransactionDialogOpen(true)}
      />
      {transactions?.length ? (
        <div className="flex flex-col justify-between w-full h-full rounded-lg p-5 bg-white shadow-sm gap-6">
          <div className="flex flex-col justify-start gap-6 h-full">
            <div className="flex flex-row justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Input
                  autoComplete="off"
                  type="search"
                  name="search"
                  role="search"
                  placeholder="Search Transaction"
                  aria-label="Search Transaction"
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
              <div className="flex flex-row justify-start items-center gap-5">
                <div>
                  <Select
                    name="sortBy"
                    value={selectedSortByValue}
                    onValueChange={(value: SortBy) => handleSortByChange(value)}
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
                    value={selectedCategory}
                    onValueChange={(value: TransactionUICategory) =>
                      handleCategoryChange(value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 w-full min-w-40">
                      <SelectValue placeholder="Transaction category" />
                    </SelectTrigger>

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
              </div>
            </div>
            <div className="overflow-x-auto h-full">
              {transactionService.isNoTransactionsSearchFound(
                searchValue,
                transactionsItems,
              ) ? (
                <div className="flex justify-center items-center h-full">
                  No Transactions Found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 cursor-default">
                  <thead className="">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-3 w-[40%] text-left text-xs text-app-color tracking-wider"
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
                        className="py-3 px-3 text-right text-xs text-app-color tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {transactionsItems.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-3">
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
                          {transactionService.getTransactionDate(tx.date)}
                        </td>
                        <td className="py-4 whitespace-nowrap font-bold text-right px-3">
                          <span
                            className={
                              tx.amount > 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {transactionService.getTransactionAmount(tx.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
