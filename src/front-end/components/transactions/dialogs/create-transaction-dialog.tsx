"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { createTransactionSRF } from "@/back-end/server-actions/transaction-actions";
import type {
  ICreateTransactionDialogProps,
  ICreateTransactionFormData,
  TransactionCategory,
} from "@/front-end/components/transactions/types";
import { Button } from "@/front-end/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/front-end/components/ui/dialog";
import { Input } from "@/front-end/components/ui/input";
import { Label } from "@/front-end/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front-end/components/ui/select";
import financeService from "@/front-end/services/finance.service";
import { handleDialogFormActionResult, orEmptyStr } from "@/lib/utils";
import constants, {
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import translationService from "@/shared/services/translation.service";
import type { ICreateTransactionValidationData } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

function setFormTransactionData(
  transactionFormData?: Partial<ICreateTransactionFormData> | undefined,
): ICreateTransactionFormData | null {
  return transactionFormData
    ? ({
        transactionType: transactionFormData?.transactionType,
        recipientOrSender: transactionFormData?.recipientOrSender,
        category: transactionFormData?.category,
        amount: orEmptyStr(transactionFormData?.amount),
        date: transactionFormData?.date,
      } as ICreateTransactionFormData)
    : null;
}

function isFormValid(
  formErrors: Partial<
    Record<keyof ICreateTransactionValidationData, string>
  > | null,
  formTransactionData: ICreateTransactionFormData | null,
) {
  return (
    !formErrors &&
    formTransactionData?.transactionType &&
    formTransactionData?.category &&
    formTransactionData?.recipientOrSender &&
    formTransactionData?.amount &&
    formTransactionData?.date
  );
}

function validateForm(
  formTransactionData: ICreateTransactionFormData,
  t: (key: string, values?: Record<string, string | number>) => string,
): Partial<Record<keyof ICreateTransactionValidationData, string>> | null {
  const validationData: ICreateTransactionValidationData = {
    transactionType: formTransactionData.transactionType,
    category: formTransactionData.category,
    recipientOrSender: formTransactionData.recipientOrSender,
    amount: orEmptyStr(formTransactionData.amount?.toString()),
    date: formTransactionData.date,
  };

  const result =
    validationService.validateCreateTransactionSchema(validationData);
  if (result.success) {
    return null;
  }
  const errors =
    validationService.createErrorsWithPath<ICreateTransactionValidationData>(
      result,
    );
  return translationService.translate(
    t,
    errors as Record<string, string>,
  ) as Partial<Record<keyof ICreateTransactionValidationData, string>>;
}

export function CreateTransactionDialog({
  isDialogOpen,
  setDialogOpen,
}: ICreateTransactionDialogProps) {
  const t = useTranslations();
  const [formResultState, formAction, isPending] = useActionState(
    createTransactionSRF,
    null,
  );

  const [formTransactionData, setFormData] =
    useState<ICreateTransactionFormData | null>(null);

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof ICreateTransactionValidationData, string>
  > | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormTransactionData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  useEffect(() => {
    if (formTransactionData) {
      setFormErrors(validateForm(formTransactionData, t));
    }
  }, [formTransactionData]);

  useEffect(() => {
    // This trigger even with first component mount when formResultState = null
    // Need to call handleOpenChange only when formResultState != null
    handleDialogFormActionResult(
      formResultState,
      isPending,
      handleOpenChange,
      undefined,
      t,
    );
  }, [formResultState]);

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
        amount: value.replaceAll(" ", ""),
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

    if (Number.isNaN(selectedDate.getTime())) {
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
            {t("i18n.TransactionsPage.CreateTitle")}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="text-app-color text-xs">
              {t("i18n.TransactionsPage.CreateDescription")}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="transactionType"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.TransactionsPage.Type")}
                </Label>

                <Select
                  name="transactionType"
                  value={formTransactionData?.transactionType}
                  onValueChange={(value) =>
                    handleTransactionTypeChange(value as TransactionType)
                  }
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue
                      placeholder={t("i18n.TransactionsPage.SelectType")}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(TransactionType).map(([name, value]) => (
                      <SelectItem
                        key={name}
                        value={value}
                        className="cursor-pointer"
                      >
                        <span>{t(`i18n.Enums.TransactionType.${name}`)}</span>
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
                  {t("i18n.TransactionsPage.CategoryPlaceholder")}
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
                    <SelectValue
                      placeholder={t("i18n.TransactionsPage.SelectCategory")}
                    />
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
                          <span>
                            {t(`i18n.Enums.Category.${categoryName}`)}
                          </span>
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
                  {t("i18n.TransactionsPage.RecipientSenderLabel")}
                </Label>
                <Input
                  className="border-gray-300"
                  id="recipientOrSender"
                  name="recipientOrSender"
                  value={formTransactionData?.recipientOrSender}
                  onChange={(e) =>
                    handleRecipientOrSenderInputChange(e.target.value)
                  }
                  placeholder={t(
                    "i18n.TransactionsPage.RecipientSenderPlaceholder",
                  )}
                  maxLength={constants.MaxPotNameCharacters}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="amount"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.TransactionsPage.AmountLabel")}
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
                  placeholder={t("i18n.Common.CashPlaceholder")}
                />
                <p className="text-xs text-red-500">{formErrors?.amount}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="date"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.TransactionsPage.Date")}
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
                  placeholder={t("i18n.TransactionsPage.ChooseDate")}
                />
                {formErrors?.date && (
                  <p className="text-xs text-red-500">{formErrors?.date}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer"
                disabled={
                  isPending || !isFormValid(formErrors, formTransactionData)
                }
              >
                {t("i18n.Common.SaveChanges")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
