"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import validationService from "@/services/validation.service";
import { setPotTotalServerAction } from "@/server-actions/pot-actions";
import potService from "@/services/pot.service";
import { IAddMoneyPotDialogProps } from "@/components/types";
import { toast } from "sonner";

export function ChangeMoneyDialog({
  children,
  pot,
  availableBalance,
  isWithdraw = false,
  isDialogOpen,
  setDialogOpen,
}: IAddMoneyPotDialogProps) {
  const [newAmount, setNewAmount] = useState("");
  const [resultTotal, setResultTotal] = useState(pot.total);
  const [amountProgress, setAmountProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setNewAmount("");
    setAmountProgress(0);
    setValidationError(null);
    setResultTotal(getResultPotTotal(newAmount, pot.total));
  }, [isDialogOpen, pot.total]);

  const handleTotalInputChange = (val: string) => {
    const newAmount = val?.replaceAll(" ", "");
    setNewAmount(newAmount);
    let targetValidationAmount = isWithdraw ? pot.total : pot.target;
    let oldTotal = isWithdraw ? 0 : pot.total;
    if (newAmount !== "") {
      const result = validationService.validateTotal(
        newAmount,
        targetValidationAmount,
        oldTotal,
        availableBalance,
      );
      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        setAmountProgress(0);
        setResultTotal(pot.total);
        return;
      }
    }
    setValidationError(null);

    const amountProgress = potService.calculateProgressPercentage(
      +newAmount,
      pot.target,
    );
    const resultPotTotal = getResultPotTotal(newAmount, pot.total);
    setResultTotal(resultPotTotal);
    setAmountProgress(amountProgress);
    return;
  };

  const handleConfirmButtonClick = async () => {
    const amountValue = +newAmount;
    const newTotal = isWithdraw
      ? pot.total - amountValue
      : pot.total + amountValue;
    const response = await setPotTotalServerAction(pot.id, newTotal);
    if (response?.success) {
      toast.success("Success", {
        description: response.message || "OK",
      });
      setDialogOpen(false);
    } else {
      toast.error("Error", {
        description: response.error || "ERROR",
      });
    }
  };

  const totalValue = potService.createCacheNumberFormat(newAmount);

  const isFormValid = () => {
    return !validationError && newAmount;
  };

  const getResultPotTotal = (newAmount: string, total: number): number => {
    const currentAmount = +newAmount || 0;
    return isWithdraw ? total - currentAmount : total + currentAmount;
  };

  const initialPotTotalProgress = potService.calculateProgressPercentage(
    pot.total,
    pot.target,
  );
  console.log(isDialogOpen);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            {isWithdraw
              ? `Withdraw from '${pot?.name}'`
              : `Add to '${pot?.name}'`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="text-app-color text-xs">
            {isWithdraw
              ? "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
              : "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="text-app-color text-xs">New Amount</div>
              <div className="font-bold text-2xl">{resultTotal} $</div>
            </div>
            <div className="flex w-full rounded-sm bg-app-background overflow-hidden h-2 gap-0.5 items-center">
              <div
                className="rounded-sm rounded-r-none h-full transition-[width] duration-500 ease-in-out w-0"
                style={{
                  backgroundColor: pot.theme,
                  width: potService.getStrPercentage(
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
                  width: potService.getStrPercentage(amountProgress),
                }}
              ></div>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="font-bold text-xs">
                {potService.getStrPercentage(
                  validationError
                    ? NaN
                    : isWithdraw
                      ? initialPotTotalProgress - amountProgress
                      : initialPotTotalProgress + amountProgress,
                )}
              </div>
              <div className="text-app-color text-xs font-semibold">
                Target of ${pot?.target.toLocaleString("en-US")}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="total" className="text-app-color text-xs font-bold">
              {isWithdraw ? "Amount to Withdraw" : "Amount to Add"}
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
              placeholder="$ e.g. 2000"
            />
            <p className="text-xs text-red-500">{validationError}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleConfirmButtonClick()}
              className="w-full h-12"
              disabled={!isFormValid()}
            >
              {isWithdraw ? "Confirm Withdrawal" : "Confirm Addition"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
