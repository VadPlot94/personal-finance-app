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
import { useActionState, useEffect, useRef, useState } from "react";
import validationService from "@/services/validation.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Theme } from "@/services/constants.service";
import { addPotServerAction } from "@/server-actions/pot-actions";

interface AddPotDialogProps {
  children: React.ReactNode;
}

interface IAddPotFormData {
  potName: string;
  target: string;
  theme: Theme;
}

export function AddPotDialog({ children }: AddPotDialogProps) {
  const [state, formAction, isPending] = useActionState(
    addPotServerAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<IAddPotFormData>({
    potName: "",
    target: "",
    theme: "" as Theme,
  });
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    validateForm(formData);
  }, [formData]);

  useEffect(() => {
    if (state?.success) {
      handleOpenChange(false);
    }
  }, [state]);

  const validateForm = (formData: IAddPotFormData) => {
    const result = validationService.validateAddPotSchema(formData);
    if (result.success) {
      setFormErrors(null);
      return;
    }
    const errors: any = {};
    result.error.issues.map((issue) => {
      const path = issue.path[0] as keyof typeof formData;
      errors[path] = issue.message;
    });
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      !formErrors && formData?.potName && formData?.target && formData?.theme
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (!newOpen) {
      setFormData({ potName: "", target: "", theme: "" as Theme });
      setFormErrors(null);
    }
  };

  const handlePotNameInputChange = (value: string): void => {
    setFormData({ ...formData, potName: value });
  };

  const handleTargetInputChange = (value: string): void => {
    setFormData({ ...formData, target: value.replaceAll(" ", "") });
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">Add New Pot</DialogTitle>
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
        <form ref={formRef} action={formAction}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-app-color text-xs">
                Create a pot to set savings targets. These can help keep you on
                track as you save for special purchases.
              </div>
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
                  value={formData?.potName}
                  onChange={(e) => handlePotNameInputChange(e.target.value)}
                  placeholder="e.g. For cookies"
                  maxLength={10}
                />
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xs text-red-500">
                    {formErrors?.["potName"]}
                  </p>
                  <p className="text-app-color text-xs min-w-25">
                    {10 - (formData?.potName?.length || 0)} Characters Left
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
                  value={formatNumber(formData.target)}
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
                  value={formData.theme}
                  onValueChange={(value) => handleThemeInputChange(value)}
                >
                  <SelectTrigger className="border-gray-300 w-full">
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(Theme).map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
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
