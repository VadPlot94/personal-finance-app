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
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import validationService from "@/services/validation.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import constants, { Theme } from "@/services/constants.service";
import {
  addPotServerAction,
  editPotServerAction,
} from "@/server-actions/pot-actions";
import { Pot } from "@prisma/client";

interface AddPotDialogProps {
  children?: React.ReactNode;
  pot?: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

interface IAddPotFormData {
  id: string;
  potName: string;
  target: string;
  theme: Theme;
}

export function AddPotDialog({ children, pot, isDialogOpen, setDialogOpen }: AddPotDialogProps) {
  const serverActionPotFn = useMemo(
    () => (pot?.id ? editPotServerAction : addPotServerAction),
    [pot?.id],
  );
  const [formResultState, formAction, isPending] = useActionState(
    serverActionPotFn,
    null,
  );

  const setFormPotData = (pot?: Pot | undefined) => ({
    id: pot?.id || "",
    potName: pot?.name || "",
    target: pot?.target?.toString() || "",
    theme: (pot?.theme || "") as Theme,
  });
  const [formPotData, setFormData] = useState<IAddPotFormData>(() =>
    setFormPotData(pot),
  );

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof IAddPotFormData, string>> | null>(null);

  useEffect(() => {
    setFormData(setFormPotData(pot));
  }, [pot, isDialogOpen]);

  useEffect(() => {
    validateForm(formPotData);
  }, [formPotData]);

  useEffect(() => {
    // This trigger even with first component mount when formResultState = null
    // Need to call handleOpenChange only when formResultState != null
    if (!formResultState) {
      return;
    }
    const isFormSavedSuccess = formResultState.success && !isPending;
    handleOpenChange(!isFormSavedSuccess);
  }, [formResultState]);

  const validateForm = (formPotData: IAddPotFormData) => {
    const result = validationService.validateAddPotSchema(formPotData);
    if (result.success) {
      setFormErrors(null);
      return;
    }
    const errors: Partial<Record<keyof IAddPotFormData, string>> = {};
    result.error.issues.map((issue) => {
      const path = issue.path[0] as keyof typeof formPotData;
      errors[path] = issue.message;
    });
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      !formErrors && formPotData?.potName && formPotData?.target && formPotData?.theme
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(setFormPotData());
      setFormErrors(null);
    }
    setDialogOpen(isOpen);
  };

  const handlePotNameInputChange = (value: string): void => {
    setFormData({ ...formPotData, potName: value });
  };

  const handleTargetInputChange = (value: string): void => {
    setFormData({ ...formPotData, target: value.replaceAll(" ", "") });
  };

  const handleThemeInputChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, theme: value as Theme }));
  };

  const formatNumber = (value: string): string => {
    if (!value || value.trim() === "" || isNaN(+value)) {
      return value;
    }
    const [integer, decimal = ""] = value.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">{!formPotData?.id ? 'Add New Pot' : 'Edit New Pot'}</DialogTitle>
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
                ? "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
                : "If your saving targets change, feel free to update your pots."}
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
                  Pot Name
                </Label>
                <Input
                  className="border-gray-300"
                  id="name"
                  name="potName"
                  value={formPotData?.potName}
                  onChange={(e) => handlePotNameInputChange(e.target.value)}
                  placeholder="e.g. For cookies"
                  maxLength={constants.MaxPotNameCharacters}
                />
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xs text-red-500">
                    {formErrors?.["potName"]}
                  </p>
                  <p className="text-app-color text-xs min-w-25">
                    {constants.MaxPotNameCharacters - (formPotData?.potName?.length || 0)} Characters Left
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="target"
                  className="text-app-color text-xs font-bold"
                >
                  Target ($)
                </Label>
                <Input
                  className="border-gray-300"
                  id="target"
                  name="target"
                  value={formatNumber(formPotData.target)}
                  type="text"
                  inputMode="decimal"
                  maxLength={12}
                  onChange={(e) => {
                    handleTargetInputChange(e.target.value);
                  }}
                  placeholder="$ e.g. 2000"
                />
                <p className="text-xs text-red-500">{formErrors?.["target"]}</p>
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
                  value={formPotData.theme}
                  onValueChange={(value) => handleThemeInputChange(value)}
                >
                  <SelectTrigger className="border-gray-300 w-full">
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(Theme).map(([themeName, themeValue]) => (
                      <SelectItem key={themeName} value={themeValue}>
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
                className="w-full h-12"
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
