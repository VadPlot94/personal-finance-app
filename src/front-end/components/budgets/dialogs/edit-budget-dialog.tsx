"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/front-end/components/ui/dialog";
import { Button } from "@/front-end/components/ui/button";
import { Input } from "@/front-end/components/ui/input";
import { Label } from "@/front-end/components/ui/label";
import {
  useActionState,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import validationService from "@/front-end/services/validation.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Theme,
  TransactionUICategory,
} from "@/front-end/services/constants.service";
import { Budget } from "@prisma/client";
import {
  IAddBudgetFormData,
  IEditBudgetDialogProps,
} from "@/front-end/components/types";
import { toast } from "sonner";
import {
  addBudgetServerAction,
  editBudgetServerAction,
} from "@/back-end/server-actions/budget-actions";
import { BudgetsContext } from "../budgets";
import financeService from "@/front-end/services/finance.service";

export function EditBudgetDialog({
  children,
  budget,
  isDialogOpen,
  setDialogOpen,
}: IEditBudgetDialogProps) {
  const serverActionBudgetFn = useMemo(
    () => (budget?.id ? editBudgetServerAction : addBudgetServerAction),
    [budget?.id],
  );
  const [formResultState, formAction, isPending] = useActionState(
    serverActionBudgetFn,
    null,
  );

  const budgets = useContext<Budget[]>(BudgetsContext);
  const busyBudgets = budget?.id
    ? budgets.filter((p) => p.category !== budget?.category)
    : budgets;
  const busyBudgetCategories = busyBudgets.map((p) => p.category);
  const busyBudgetThemes = busyBudgets.map((p) => p.theme);

  const setFormBudgetData = (
    budget?: Partial<IAddBudgetFormData> | Partial<Budget> | undefined,
  ) =>
    budget
      ? {
          id: budget?.id || "",
          budgetCategory:
            (budget as Budget)?.category ||
            (budget as IAddBudgetFormData)?.budgetCategory ||
            "",
          maximum: budget?.maximum?.toString() || "",
          theme: (budget?.theme || "") as Theme,
        }
      : null;
  const [formBudgetData, setFormData] = useState<IAddBudgetFormData | null>(
    () => setFormBudgetData(budget),
  );

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof IAddBudgetFormData, string>
  > | null>(null);

  useEffect(() => {
    setFormData(setFormBudgetData(budget));
  }, [budget, isDialogOpen]);

  useEffect(() => {
    if (formBudgetData) {
      validateForm(formBudgetData);
    }
  }, [formBudgetData]);

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

  const validateForm = (formBudgetData: IAddBudgetFormData) => {
    const result = validationService.validateAddBudgetSchema(formBudgetData);
    if (result.success) {
      setFormErrors(null);
      return;
    }
    const errors =
      validationService.createErrorsWithPath<Partial<IAddBudgetFormData>>(
        result,
      );
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      !formErrors &&
      formBudgetData?.budgetCategory &&
      formBudgetData?.maximum &&
      formBudgetData?.theme
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormBudgetData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  const handleBudgetCategoryInputChange = (
    value: TransactionUICategory,
  ): void => {
    setFormData(setFormBudgetData({ ...formBudgetData, category: value }));
  };

  const handleMaximumInputChange = (value: string): void => {
    setFormData(
      setFormBudgetData({
        ...formBudgetData,
        maximum: value.replaceAll(" ", "") as any,
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
            {!formBudgetData?.id ? "Add New Budget" : "Edit New Budget"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="text-app-color text-xs">
              {!formBudgetData?.id
                ? "Choose a category to set a spending budget. These categories can help you monitor spending."
                : "As your budgets change, feel free to update your spending limits."}
            </div>
            <div className="flex flex-col gap-2">
              {formBudgetData?.id && (
                <input type="hidden" name="id" value={formBudgetData.id} />
              )}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="budgetCategory"
                  className="text-app-color text-xs font-bold"
                >
                  Budget Category
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
                    <SelectValue placeholder="Select category" />
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
                          <span>{categoryName}</span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="maximum"
                  className="text-app-color text-xs font-bold"
                >
                  Maximum ($)
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
                  placeholder="$ e.g. 2000"
                />
                <p className="text-xs text-red-500">
                  {formErrors?.["maximum"]}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="theme"
                  className="text-app-color text-xs font-bold"
                >
                  Theme
                </Label>

                <Select
                  name="theme"
                  value={formBudgetData?.theme}
                  onValueChange={(value) => handleThemeInputChange(value)}
                >
                  <SelectTrigger className="border-gray-300 w-full cursor-pointer">
                    <SelectValue placeholder="Select Theme" />
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
                          <span>{themeName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
