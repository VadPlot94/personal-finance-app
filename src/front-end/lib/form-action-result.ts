import { toast } from "sonner";

export interface IFormActionResult {
  success: boolean;
  message?: string;
  error?: string | null;
  zodErrors?: Record<string, string>;
}

export function handleDialogFormActionResult(
  formResultState: IFormActionResult | null,
  isPending: boolean,
  onOpenChange: (isOpen: boolean) => void,
  setFormErrors?: (errors: Record<string, string>) => void,
): void {
  if (!formResultState) {
    return;
  }

  const isFormSavedSuccess = formResultState.success && !isPending;

  if (isFormSavedSuccess) {
    toast.success("Success", {
      description: formResultState.message || "OK",
    });
  } else if (formResultState.zodErrors && setFormErrors) {
    setFormErrors(formResultState.zodErrors);
  } else {
    toast.error("Error", {
      description: formResultState.error || "ERROR",
    });
  }

  onOpenChange(!isFormSavedSuccess);
}
