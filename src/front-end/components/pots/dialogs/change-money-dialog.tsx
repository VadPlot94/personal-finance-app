"use client";

import type { Pot } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { setPotTotalSRF } from "@/back-end/server-actions/pot-actions";
import type { IAddMoneyPotDialogProps } from "@/front-end/components/pots/types";
import { Button } from "@/front-end/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/front-end/components/ui/dialog";
import { Input } from "@/front-end/components/ui/input";
import { Label } from "@/front-end/components/ui/label";
import financeService from "@/front-end/services/finance.service";
import { handleDialogFormActionResult } from "@/lib/utils";
import translationService from "@/shared/services/translation.service";
import type { Translator } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

function getResultPotTotal(
  newAmount: string,
  total: number,
  isWithdraw: boolean,
): number {
  const currentAmount = +newAmount || 0;
  return isWithdraw ? total - currentAmount : total + currentAmount;
}

function isFormValid(validationError: string | null, newAmount: string) {
  return !validationError && newAmount;
}

function computeAmountInputResult(
  val: string,
  pot: Pot,
  availableBalance: number,
  isWithdraw: boolean,
  t: Translator,
) {
  const newAmount = val?.replaceAll(" ", "");
  const targetValidationAmount = isWithdraw ? pot.total : pot.target;
  const oldTotal = isWithdraw ? 0 : pot.total;
  if (newAmount !== "") {
    const result = validationService.validateTotal(
      newAmount,
      targetValidationAmount,
      oldTotal,
      availableBalance,
    );

    if (!result.success) {
      return {
        newAmount,
        validationError: translationService.translate(
          t,
          result.error.issues[0].message,
        ),
        amountProgress: 0,
        resultTotal: pot.total,
      };
    }
  }

  const amountProgress = financeService.calculateProgressPercentage(
    +newAmount,
    pot.target,
  );
  const resultTotal = getResultPotTotal(newAmount, pot.total, isWithdraw);

  return {
    newAmount,
    validationError: null as string | null,
    amountProgress,
    resultTotal,
  };
}

export function ChangeMoneyDialog({
  children,
  pot,
  availableBalance,
  isWithdraw = false,
  isDialogOpen,
  setDialogOpen,
}: IAddMoneyPotDialogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [newAmount, setNewAmount] = useState("");
  const [resultTotal, setResultTotal] = useState(pot.total);
  const [amountProgress, setAmountProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setNewAmount("");
    setAmountProgress(0);
    setValidationError(null);
    setResultTotal(getResultPotTotal(newAmount, pot.total, isWithdraw));
  }, [isDialogOpen, pot.total]);

  const handleTotalInputChange = (val: string) => {
    const result = computeAmountInputResult(
      val,
      pot,
      availableBalance,
      isWithdraw,
      t,
    );
    setNewAmount(result.newAmount);
    setValidationError(result.validationError);
    setAmountProgress(result.amountProgress);
    setResultTotal(result.resultTotal);
  };

  const handleConfirmButtonClick = async () => {
    const amountValue = +newAmount;
    const newTotal = isWithdraw
      ? pot.total - amountValue
      : pot.total + amountValue;
    const response = await setPotTotalSRF(pot.id, newTotal);
    handleDialogFormActionResult(
      response,
      false,
      setDialogOpen,
      (errors) => {
        setValidationError(Object.values(errors)[0] ?? null);
      },
      t,
    );
  };

  const totalValue = financeService.createCacheNumberFormat(newAmount);

  const initialPotTotalProgress = financeService.calculateProgressPercentage(
    pot.total,
    pot.target,
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            {isWithdraw
              ? t("i18n.PotsPage.WithdrawTitle", { name: pot?.name })
              : t("i18n.PotsPage.AddTitle", { name: pot?.name })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="text-app-color text-xs">
            {isWithdraw
              ? t("i18n.PotsPage.WithdrawDescription")
              : t("i18n.PotsPage.AddDescriptionMoney")}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="text-app-color text-xs">
                {t("i18n.PotsPage.NewAmount")}
              </div>
              <div className="font-bold text-2xl">{resultTotal} $</div>
            </div>
            <div className="flex w-full rounded-sm bg-app-background overflow-hidden h-2 gap-0.5 items-center">
              <div
                className="rounded-sm rounded-r-none h-full transition-[width] duration-500 ease-in-out w-0"
                style={{
                  backgroundColor: pot.theme,
                  width: financeService.getStrPercentage(
                    isWithdraw
                      ? initialPotTotalProgress - amountProgress
                      : initialPotTotalProgress,
                  ),
                }}
              ></div>
              <div
                className="rounded-sm rounded-l-none h-full transition-[width] duration-500 ease-in-out w-0 opacity-50"
                style={{
                  backgroundColor: pot.theme,
                  width: financeService.getStrPercentage(amountProgress),
                }}
              ></div>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="font-bold text-xs">
                {financeService.getStrPercentage(
                  validationError
                    ? NaN
                    : isWithdraw
                      ? initialPotTotalProgress - amountProgress
                      : initialPotTotalProgress + amountProgress,
                )}
              </div>
              <div className="text-app-color text-xs font-semibold">
                {t("i18n.PotsPage.TargetOf", {
                  amount: `$${pot?.target.toLocaleString(locale)}`,
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="total" className="text-app-color text-xs font-bold">
              {isWithdraw
                ? t("i18n.PotsPage.AmountToWithdraw")
                : t("i18n.PotsPage.AmountToAdd")}
            </Label>
            <Input
              className="border-gray-300"
              id="total"
              name="total"
              value={totalValue}
              type="text"
              inputMode="decimal"
              maxLength={12}
              onChange={(e) => {
                handleTotalInputChange(e.target.value);
              }}
              placeholder={t("i18n.Common.CashPlaceholder")}
            />
            <p className="text-xs text-red-500">{validationError}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleConfirmButtonClick()}
              className="w-full h-12 cursor-pointer"
              disabled={!isFormValid(validationError, newAmount)}
            >
              {isWithdraw
                ? t("i18n.PotsPage.ConfirmWithdrawal")
                : t("i18n.PotsPage.ConfirmAddition")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
