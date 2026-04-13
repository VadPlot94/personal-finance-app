"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/front-end/components/ui/dialog";
import { Button } from "@/front-end/components/ui/button";
import { Input } from "@/front-end/components/ui/input";
import { Label } from "@/front-end/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import validationService from "@/front-end/services/validation.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import constants, {
  TransactionType,
  TransactionUICategory,
} from "@/front-end/services/constants.service";
import {
  ICreateTransactionFormData,
  ICreateTransactionDialogProps,
  TransactionCategory,
} from "@/front-end/components/types";
import { toast } from "sonner";
import financeService from "@/front-end/services/finance.service";
import { createTransactionServerAction } from "@/back-end/server-actions/transaction-actions";

export function CreateTransactionDialog({
  isDialogOpen,
  setDialogOpen,
}: ICreateTransactionDialogProps) {
  const [formResultState, formAction, isPending] = useActionState(
    createTransactionServerAction,
    null,
  );

  const setFormTransactionData = (
    transactionFormData?: Partial<ICreateTransactionFormData> | undefined,
  ): ICreateTransactionFormData | null => {
    return transactionFormData
      ? ({
          transactionType: transactionFormData?.transactionType,
          recipientOrSender: transactionFormData?.recipientOrSender,
          category: transactionFormData?.category,
          amount: (transactionFormData?.amount?.toString() ||
            "") as unknown as number,
          date: transactionFormData?.date,
        } as ICreateTransactionFormData)
      : null;
  };

  const [formTransactionData, setFormData] =
    useState<ICreateTransactionFormData | null>(null);

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof ICreateTransactionFormData, string>
  > | null>(null);

  useEffect(() => {
    if (formTransactionData) {
      validateForm(formTransactionData);
    }
  }, [formTransactionData]);

  useEffect(() => {
    // This trigger even with first component mount when formResultState = null
    // Need to call handleOpenChange only when formResultState != null
    if (!formResultState) {
      return;
    }
    const isFormSavedSuccess = formResultState.success && !isPending;

    if (isFormSavedSuccess) {
      toast.success("Success", {
        description: formResultState.message || "OK",
      });
    } else {
      toast.error("Error", {
        description: formResultState.error || "ERROR",
      });
    }
    handleOpenChange(!isFormSavedSuccess);
  }, [formResultState]);

  const validateForm = (formTransactionData: ICreateTransactionFormData) => {
    const result =
      validationService.validateCreateTransactionSchema(formTransactionData);
    if (result.success) {
      setFormErrors(null);
      return;
    }
    const errors =
      validationService.createErrorsWithPath<ICreateTransactionFormData>(
        result,
      );
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      !formErrors &&
      formTransactionData?.transactionType &&
      formTransactionData?.category &&
      formTransactionData?.recipientOrSender &&
      formTransactionData?.amount &&
      formTransactionData?.date
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormTransactionData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  const handleTransactionTypeChange = (value: TransactionType): void => {
    setFormData(
      setFormTransactionData({
        ...formTransactionData,
        transactionType: value,
      }),
    );
  };

  const handleTransactionCategoryChange = (
    value: TransactionCategory,
  ): void => {
    setFormData(
      setFormTransactionData({ ...formTransactionData, category: value }),
    );
  };

  const handleAmountInputChange = (value: string): void => {
    setFormData(
      setFormTransactionData({
        ...formTransactionData,
        amount: value.replaceAll(" ", "") as any,
      }),
    );
  };

  const handleRecipientOrSenderInputChange = (value: string): void => {
    setFormData(
      setFormTransactionData({
        ...formTransactionData,
        recipientOrSender: value,
      }),
    );
  };

  const handleDateInputChange = (value: string): void => {
    // Validate date - not set transaction in future!
    let selectedDate: Date | undefined = new Date(value);

    if (isNaN(selectedDate.getTime())) {
      selectedDate = undefined;
    }
    setFormData(
      setFormTransactionData({ ...formTransactionData, date: value }),
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Create Transaction
          </DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="text-app-color text-xs">
              Create new transaction for testing purposes.
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="transactionType"
                  className="text-app-color text-xs font-bold"
                >
                  Type
                </Label>

                <Select
                  name="transactionType"
                  value={formTransactionData?.transactionType}
                  onValueChange={(value) =>
                    handleTransactionTypeChange(value as TransactionType)
                  }
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(TransactionType).map(([name, value]) => (
                      <SelectItem
                        key={name}
                        value={value}
                        className="cursor-pointer"
                      >
                        <span>{name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="category"
                  className="text-app-color text-xs font-bold"
                >
                  Transaction category
                </Label>

                <Select
                  name="category"
                  value={formTransactionData?.category}
                  onValueChange={(value) =>
                    handleTransactionCategoryChange(
                      value as TransactionCategory,
                    )
                  }
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(TransactionUICategory)
                      .filter(
                        (c) => c[1] !== TransactionUICategory.AllTransactions,
                      )
                      .map(([categoryName, categoryValue]) => (
                        <SelectItem
                          key={categoryName}
                          value={categoryValue}
                          className="cursor-pointer"
                        >
                          <span>{categoryName}</span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="recipientOrSender"
                  className="text-app-color text-xs font-bold"
                >
                  Recipient/Sender
                </Label>
                <Input
                  className="border-gray-300"
                  id="recipientOrSender"
                  name="recipientOrSender"
                  value={formTransactionData?.recipientOrSender}
                  onChange={(e) =>
                    handleRecipientOrSenderInputChange(e.target.value)
                  }
                  placeholder="e.g. Mark, Steve, etc"
                  maxLength={constants.MaxPotNameCharacters}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="amount"
                  className="text-app-color text-xs font-bold"
                >
                  Amount ($)
                </Label>
                <Input
                  className="border-gray-300"
                  id="amount"
                  name="amount"
                  value={financeService.createCacheNumberFormat(
                    formTransactionData?.amount,
                  )}
                  type="text"
                  inputMode="decimal"
                  maxLength={12}
                  onChange={(e) => {
                    handleAmountInputChange(e.target.value);
                  }}
                  placeholder="$ e.g. 2000"
                />
                <p className="text-xs text-red-500">{formErrors?.["amount"]}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="date"
                  className="text-app-color text-xs font-bold"
                >
                  Date
                </Label>
                <Input
                  type="date"
                  className="border-gray-300"
                  id="date"
                  name="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={
                    formTransactionData?.date
                      ? formTransactionData.date?.split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDateInputChange(e.target.value)}
                  placeholder="Choose Date"
                />
                {formErrors?.date && (
                  <p className="text-xs text-red-500">{formErrors.date}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer"
                disabled={isPending || !isFormValid()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
