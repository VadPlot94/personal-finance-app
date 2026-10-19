"use client";

import type { Budget } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  useActionState,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUpdateEffect } from "react-use";
import {
  addBudgetSRF,
  editBudgetSRF,
} from "@/back-end/server-actions/budget-actions";
import { BudgetsContext } from "@/front-end/components/budgets/budgets";
import type { IEditBudgetDialogProps } from "@/front-end/components/budgets/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front-end/components/ui/select";
import financeService from "@/front-end/services/finance.service";
import { handleDialogFormActionResult, orEmptyStr } from "@/lib/utils";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import translationService from "@/shared/services/translation.service";
import type { IAddBudgetFormData } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

function setFormBudgetData(
  budget?: Partial<IAddBudgetFormData> | Partial<Budget> | null | undefined,
): IAddBudgetFormData | null {
  return budget
    ? {
        id: orEmptyStr(budget?.id),
        budgetCategory: orEmptyStr(
          (budget as Budget)?.category ||
            (budget as IAddBudgetFormData)?.budgetCategory,
        ),
        maximum: orEmptyStr(budget?.maximum?.toString()),
        theme: orEmptyStr(budget?.theme) as Theme,
      }
    : null;
}

function isFormValid(
  formErrors: Partial<Record<keyof IAddBudgetFormData, string>> | null,
  formBudgetData: IAddBudgetFormData | null,
) {
  return (
    !formErrors &&
    formBudgetData?.budgetCategory &&
    formBudgetData?.maximum &&
    formBudgetData?.theme
  );
}

function validateForm(
  formBudgetData: IAddBudgetFormData,
  t: (key: string, values?: Record<string, string | number>) => string,
): Partial<Record<keyof IAddBudgetFormData, string>> | null {
  const result = validationService.validateAddBudgetSchema(formBudgetData);
  if (result.success) {
    return null;
  }
  const errors =
    validationService.createErrorsWithPath<Partial<IAddBudgetFormData>>(result);
  return translationService.translate(
    t,
    errors as Record<string, string>,
  ) as Partial<Record<keyof IAddBudgetFormData, string>>;
}

function getBusyBudgets(budgets: Budget[], budget?: Budget | null): Budget[] {
  return budget?.id
    ? budgets.filter((p) => p.category !== budget?.category)
    : budgets;
}

function getBusyBudgetCategories(budgets: Budget[], budget?: Budget | null) {
  return getBusyBudgets(budgets, budget).map((p) => p.category);
}

function getBusyBudgetThemes(budgets: Budget[], budget?: Budget | null) {
  return getBusyBudgets(budgets, budget).map((p) => p.theme);
}

export function EditBudgetDialog({
  children,
  budget,
  isDialogOpen,
  setDialogOpen,
}: IEditBudgetDialogProps) {
  const t = useTranslations();
  const serverActionBudgetFn = useMemo(
    () => (budget?.id ? editBudgetSRF : addBudgetSRF),
    [budget?.id],
  );
  const [formResultState, formAction, isPending] = useActionState(
    serverActionBudgetFn,
    null,
  );

  const budgets = useContext<Budget[]>(BudgetsContext);
  const busyBudgetCategories = getBusyBudgetCategories(budgets, budget);
  const busyBudgetThemes = getBusyBudgetThemes(budgets, budget);

  const [formBudgetData, setFormData] = useState<IAddBudgetFormData | null>(
    () => setFormBudgetData(budget),
  );

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof IAddBudgetFormData, string>
  > | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormBudgetData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  useEffect(() => {
    setFormData(setFormBudgetData(budget));
  }, [budget, isDialogOpen]);

  useEffect(() => {
    if (formBudgetData) {
      setFormErrors(validateForm(formBudgetData, t));
    }
  }, [formBudgetData]);

  useUpdateEffect(() => {
    // useEffect run on component mount too - not only on update - first mount formResultState = null - we do not need this case
    // Need to call handleOpenChange only when formResultState != null
    // Then we use useUpdateEffect to run only on update - not on first mount
    handleDialogFormActionResult(
      formResultState,
      isPending,
      handleOpenChange,
      setFormErrors,
      t,
    );
  }, [formResultState]);

  const handleBudgetCategoryInputChange = (
    value: TransactionUICategory,
  ): void => {
    setFormData(setFormBudgetData({ ...formBudgetData, category: value }));
  };

  const handleMaximumInputChange = (value: string): void => {
    setFormData(
      setFormBudgetData({
        ...formBudgetData,
        maximum: value.replaceAll(" ", ""),
      }),
    );
  };

  const handleThemeInputChange = (value: string): void => {
    setFormData((prev) =>
      setFormBudgetData({ ...prev, theme: value as Theme }),
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            {!formBudgetData?.id
              ? t("i18n.BudgetsPage.AddNewBudget")
              : t("i18n.BudgetsPage.EditNewBudget")}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="text-app-color text-xs">
              {!formBudgetData?.id
                ? t("i18n.BudgetsPage.AddDescription")
                : t("i18n.BudgetsPage.EditDescription")}
            </div>
            <div className="flex flex-col gap-2">
              {formBudgetData?.id && (
                <>
                  {/* TODO: formErrors?.["id"] appears in the dialog when empty — need to hide somehow */}
                  <input type="hidden" name="id" value={formBudgetData.id} />
                  <p className="text-xs text-red-500">{formErrors?.id}</p>
                </>
              )}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="budgetCategory"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.BudgetsPage.BudgetCategory")}
                </Label>

                <Select
                  name="budgetCategory"
                  value={formBudgetData?.budgetCategory}
                  onValueChange={(value) =>
                    handleBudgetCategoryInputChange(
                      value as TransactionUICategory,
                    )
                  }
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue
                      placeholder={t("i18n.BudgetsPage.SelectCategory")}
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
                          disabled={busyBudgetCategories.includes(
                            categoryValue,
                          )}
                          className="cursor-pointer"
                        >
                          <span>
                            {t(`i18n.Enums.Category.${categoryName}`)}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {/* TODO: formErrors appears in the dialog when empty — need to hide somehow */}
                <p className="text-xs text-red-500">
                  {formErrors?.budgetCategory}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="maximum"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.BudgetsPage.Maximum")}
                </Label>
                <Input
                  className="border-gray-300"
                  id="maximum"
                  name="maximum"
                  value={financeService.createCacheNumberFormat(
                    formBudgetData?.maximum,
                  )}
                  type="text"
                  inputMode="decimal"
                  maxLength={12}
                  onChange={(e) => {
                    handleMaximumInputChange(e.target.value);
                  }}
                  placeholder={t("i18n.Common.CashPlaceholder")}
                />
                <p className="text-xs text-red-500">{formErrors?.maximum}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="theme"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.Common.Theme")}
                </Label>

                <Select
                  name="theme"
                  value={formBudgetData?.theme}
                  onValueChange={(value) => handleThemeInputChange(value)}
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue placeholder={t("i18n.Common.SelectTheme")} />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(Theme).map(([themeName, themeValue]) => (
                      <SelectItem
                        key={themeName}
                        value={themeValue}
                        disabled={busyBudgetThemes.includes(themeValue)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: themeValue }}
                          />
                          <span>{t(`i18n.Enums.Theme.${themeName}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* TODO: formErrors appears in the dialog when empty — need to hide somehow */}
                <p className="text-xs text-red-500">{formErrors?.theme}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer"
                disabled={isPending || !isFormValid(formErrors, formBudgetData)}
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
