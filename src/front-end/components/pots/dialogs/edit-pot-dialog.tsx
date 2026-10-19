"use client";

import type { Pot } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  useActionState,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createPotSRF,
  editPotSRF,
} from "@/back-end/server-actions/pot-actions";
import { PotsContext } from "@/front-end/components/pots/pots";
import type { IEditPotDialogProps } from "@/front-end/components/pots/types";
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
import constants, { Theme } from "@/shared/services/constants.service";
import translationService from "@/shared/services/translation.service";
import type { ICreatePotFormData } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

function setFormPotData(
  pot?: Partial<ICreatePotFormData> | Partial<Pot> | undefined,
): ICreatePotFormData | null {
  return pot
    ? {
        id: orEmptyStr(pot?.id),
        potName: orEmptyStr(
          (pot as Pot)?.name || (pot as ICreatePotFormData)?.potName,
        ),
        target: orEmptyStr(pot?.target?.toString()),
        theme: orEmptyStr(pot?.theme) as Theme,
      }
    : null;
}

function isFormValid(
  formErrors: Partial<Record<keyof ICreatePotFormData, string>> | null,
  formPotData: ICreatePotFormData | null,
) {
  return (
    !formErrors &&
    formPotData?.potName &&
    formPotData?.target &&
    formPotData?.theme
  );
}

function validateForm(
  formPotData: ICreatePotFormData,
  potNames: string[],
  potTotal: number | undefined,
  t: (key: string, values?: Record<string, string | number>) => string,
): Partial<Record<keyof ICreatePotFormData, string>> | null {
  const result = validationService.validateCreatePotSchema(
    formPotData,
    potNames,
    potTotal,
  );

  if (result.success) {
    return null;
  }
  const errors =
    validationService.createErrorsWithPath<Partial<ICreatePotFormData>>(result);
  return translationService.translate(
    t,
    errors as Record<string, string>,
  ) as Partial<Record<keyof ICreatePotFormData, string>>;
}

function getOtherPotNames(pots: Pot[], pot?: Pot): string[] {
  return (pot?.id ? pots.filter((p) => p.name !== pot?.name) : pots).map(
    (p) => p.name,
  );
}

export function EditPotDialog({
  children,
  pot,
  isDialogOpen,
  setDialogOpen,
}: IEditPotDialogProps) {
  const t = useTranslations();
  const serverActionPotFn = useMemo(
    () => (pot?.id ? editPotSRF : createPotSRF),
    [pot?.id],
  );
  const [formResultState, formAction, isPending] = useActionState(
    serverActionPotFn,
    null,
  );

  const pots = useContext<Pot[]>(PotsContext);
  const potNames = getOtherPotNames(pots, pot);

  const [formPotData, setFormData] = useState<ICreatePotFormData | null>(() =>
    setFormPotData(pot),
  );

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof ICreatePotFormData, string>
  > | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormPotData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  useEffect(() => {
    setFormData(setFormPotData(pot));
  }, [pot, isDialogOpen]);

  useEffect(() => {
    if (formPotData) {
      setFormErrors(validateForm(formPotData, potNames, pot?.total, t));
    }
  }, [formPotData]);

  useEffect(() => {
    // This trigger even with first component mount when formResultState = null
    // Need to call handleOpenChange only when formResultState != null
    handleDialogFormActionResult(
      formResultState,
      isPending,
      handleOpenChange,
      setFormErrors,
      t,
    );
  }, [formResultState]);

  const handlePotNameInputChange = (value: string): void => {
    setFormData(setFormPotData({ ...formPotData, name: value }));
  };

  const handleTargetInputChange = (value: string): void => {
    setFormData(
      setFormPotData({
        ...formPotData,
        target: value.replaceAll(" ", ""),
      }),
    );
  };

  const handleThemeInputChange = (value: string): void => {
    setFormData((prev) => setFormPotData({ ...prev, theme: value as Theme }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            {!formPotData?.id
              ? t("i18n.PotsPage.AddNewPot")
              : t("i18n.PotsPage.EditNewPot")}
          </DialogTitle>
        </DialogHeader>
        {/*
        Two form cases:
          1) <form onSubmit={handleSubmit}></form>
              - send formData from fields to handleSubmit listener on client side
              - then inside handleSubmit - we can send request to server
              - new FormData(e.currentTarget) - get data from fields inside handleSubmit listener
              - !such approach useful when you would like validate data before server request or send data not like FormData but in JSON format for ex 
          2) <form action={formAction}></form>
              - send formData directly on server without handling on client (lik post http request with FormData)
              - In case on NextJs we can use 'Server Actions' to get such client request on server side
          - name="potName" <inside input> — required for formData.get()
        */}
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="text-app-color text-xs">
              {!formPotData?.id
                ? t("i18n.PotsPage.AddDescription")
                : t("i18n.PotsPage.EditDescription")}
            </div>
            <div className="flex flex-col gap-2">
              {formPotData?.id && (
                <input type="hidden" name="id" value={formPotData.id} />
              )}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.PotsPage.PotName")}
                </Label>
                <Input
                  className="border-gray-300"
                  id="name"
                  name="potName"
                  value={formPotData?.potName}
                  onChange={(e) => handlePotNameInputChange(e.target.value)}
                  placeholder={t("i18n.PotsPage.PotNamePlaceholder")}
                  maxLength={constants.MaxPotNameCharacters}
                />
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xs text-red-500">{formErrors?.potName}</p>
                  <p className="text-app-color text-xs min-w-25">
                    {constants.MaxPotNameCharacters -
                      (formPotData?.potName?.length || 0)}{" "}
                    {t("i18n.PotsPage.CharactersLeft")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="target"
                  className="text-app-color text-xs font-bold"
                >
                  {t("i18n.PotsPage.Target")}
                </Label>
                <Input
                  className="border-gray-300"
                  id="target"
                  name="target"
                  value={financeService.createCacheNumberFormat(
                    formPotData?.target,
                  )}
                  type="text"
                  inputMode="decimal"
                  maxLength={12}
                  onChange={(e) => {
                    handleTargetInputChange(e.target.value);
                  }}
                  placeholder={t("i18n.Common.CashPlaceholder")}
                />
                <p className="text-xs text-red-500">{formErrors?.target}</p>
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
                  value={formPotData?.theme}
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
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer"
                disabled={isPending || !isFormValid(formErrors, formPotData)}
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
