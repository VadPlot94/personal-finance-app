import { z } from "zod";
import logger from "./logger.service";
import constants, {
  TransactionType,
  TransactionUICategory,
} from "./constants.service";
import {
  IAddBudgetFormData,
  IAddPotFormData,
  ICreateTransactionFormData,
} from "@/components/types";

class ValidationService {
  private getCommonCashNumberSchema(
    minValue: number | undefined,
  ): z.ZodType<string> {
    return z
      .string()
      .trim()
      .refine((val) => val !== "", { message: "" })
      .pipe(
        z
          .string()
          .regex(/^[1-9]\d*$/, {
            message: "Please enter valid cash (only digits, no leading zero)",
          })
          .refine(
            (val) => {
              const num = Number(val);
              return !isNaN(num);
            },
            { message: "Value must be a valid number" },
          )
          .refine(
            (val) => {
              return Number(val) >= (minValue || 0);
            },
            { message: `Value can not be less then total: ${minValue || 0}` },
          ),
      );
  }

  private getCommonNameSchema(excludedNames: string[]): z.ZodType<string> {
    return z
      .string()
      .trim()
      .refine((val) => val !== "", { message: "" })
      .pipe(
        z
          .string()
          .min(3, {
            message: "The value must be at least 3 characters long",
          })
          .max(constants.MaxPotNameCharacters, {
            message: `The value is too long (max. ${constants.MaxPotNameCharacters} characters)`,
          })
          .regex(/^[a-zA-Z0-9\s\-_]+$/, {
            message:
              "Only letters, numbers, spaces, hyphens and underscores are allowed",
          })
          .refine((val) => !excludedNames.includes(val), {
            message: "Such value already exist",
          }),
      );
  }

  private addBudgetSchema = z.object({
    maximum: this.getCommonCashNumberSchema(0),
  });

  private getPotNameSchema(potNames: string[]): z.ZodType<string> {
    return this.getCommonNameSchema(potNames);
  }

  private getAddPotTargetSchema(
    potTotal: number | undefined,
  ): z.ZodType<string> {
    return this.getCommonCashNumberSchema(potTotal);
  }

  private getTotalSchema(
    target: number,
    oldTotal: number,
    currentBalance: number,
  ) {
    return this.getCommonCashNumberSchema(0)
      .refine((val) => Number(val) + oldTotal <= currentBalance, {
        message: `Value cannot exceed 'Available Balance' (${currentBalance} $)`,
      })
      .refine((val) => Number(val) + oldTotal <= target, {
        message: `Value cannot exceed 'Target' (${target} $)`,
      });
  }

  private createTransactionFormDataSchema = z.object({
    transactionType: z
      .enum(Object.values(TransactionType))
      .optional()
      .refine((val) => !!val, {
        message: "Please select transaction type",
      }),

    category: z
      .enum(
        Object.values(TransactionUICategory).filter(
          (c) => c !== TransactionUICategory.AllTransactions,
        ),
      )
      .optional()
      .refine((val) => !!val, {
        message: "Please select category",
      }),

    recipientOrSender: this.getCommonNameSchema([]),

    amount: this.getCommonCashNumberSchema(0),

    date: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.trim() === "", {
        message: "",
      })
      .or(
        z
          .string()
          .trim()
          .min(1, { message: "Date is required" })
          .refine((val) => !isNaN(Date.parse(val)), {
            message: "Please select a valid date",
          })
          .transform((val) => new Date(val))
          .refine((date) => date <= new Date(), {
            message: "Date cannot be in the future",
          })
          .refine(
            (date) => {
              const minDate = new Date();
              minDate.setFullYear(minDate.getFullYear() - 15);
              return date >= minDate;
            },
            {
              message: "Date cannot be more than 15 years in the past",
            },
          ),
      ),
  });

  public validateAddPotSchema(
    formData: IAddPotFormData,
    potNames: string[],
    potTotal: number | undefined,
  ): z.ZodSafeParseResult<object> {
    const validationObj = z
      .object({
        potName: this.getPotNameSchema(potNames),
        target: this.getAddPotTargetSchema(potTotal),
      })
      .safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Add Pot");
    }
    return validationObj;
  }

  public validateTotal(
    additionalAmount: number | string,
    target: number,
    total: number,
    availableBalance: number,
  ): z.ZodSafeParseResult<string> {
    const validationObj = this.getTotalSchema(
      target,
      total,
      availableBalance,
    ).safeParse(additionalAmount);

    if (validationObj.error) {
      validationObj.error.issues.forEach((issue: z.core.$ZodIssue) => {
        logger.logError(
          `Total: '${additionalAmount}' -> ${issue.code}: ${issue.message.toString()}`,
        );
      });
    }

    return validationObj;
  }

  public validateAddBudgetSchema(formData: IAddBudgetFormData) {
    const validationObj = this.addBudgetSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Add Budget");
    }

    return validationObj;
  }

  public validateCreateTransactionSchema(
    formData: ICreateTransactionFormData,
  ): z.ZodSafeParseResult<ICreateTransactionFormData> {
    const validationObj =
      this.createTransactionFormDataSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Create Transaction");
    }

    return validationObj as unknown as z.ZodSafeParseResult<ICreateTransactionFormData>;
  }

  public createErrorsWithPath<T>(
    result: z.ZodSafeParseError<T>,
  ): Partial<Record<keyof T, string>> {
    const errors: Partial<Record<keyof T, string>> = {};
    result.error.issues.map((issue) => {
      const path = issue.path[0] as keyof T;
      if (!errors[path]) {
        errors[path] = validationService.getZodIssueErrorMessage(issue);
      }
    });
    return errors;
  }

  private logZodErrors(error: z.ZodError, context: string) {
    error.issues.forEach((issue) => {
      const path = issue.path.join(".") || "root";
      const message = this.getZodIssueErrorMessage(issue);
      logger.logError(
        `[${context}] Validation failed at "${path}": ${issue.code} - ${message}`,
      );
    });
  }

  private getZodIssueErrorMessage(issue: z.core.$ZodIssue) {
    let message = Array.isArray(issue.message)
      ? issue.message.join(", ")
      : issue.message;
    const innerErrors = (issue as any)?.errors
      ?.flat()
      ?.map((error: any) => error?.message)
      ?.filter((message: string) => !!message)
      ?.join(", ");
    if (innerErrors) {
      message += ": " + innerErrors;
    }
    return message;
  }
}

const validationService = new ValidationService();
export default validationService;
