import { z } from "zod";
import logger from "../../front-end/services/logger.service";
import constants, {
  Theme,
  TransactionType,
  TransactionUICategory,
} from "./constants.service";
import {
  IAddBudgetValidationData,
  ICreatePotValidationData,
  ICreateTransactionValidationData,
  IRegisterValidationData,
  ISignInValidationData,
} from "./types";
import { Pot } from "@prisma/client";

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

  private getCommonNameSchema(excludedNames?: string[]): z.ZodType<string> {
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
          .refine((val) => !excludedNames?.includes(val), {
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
        message: `Value cannot exceed 'Target'/'Total' (${target} $)`,
      });
  }

  private registerFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
  });

  private signInFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

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

    recipientOrSender: this.getCommonNameSchema(),

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

  public validateCreatePotSchemaServer(potModel: Partial<Pot>) {
    return this.validateCreatePotSchema(
      {
        id: potModel.id as string,
        theme: potModel.theme as Theme,
        potName: potModel.name as string,
        target: potModel.target?.toString() as string,
      },
      [],
      potModel.total,
    );
  }

  public validateCreatePotSchema(
    formData: ICreatePotValidationData,
    potNames: string[],
    potTotal: number | undefined,
  ): z.ZodSafeParseResult<object> {
    const validationObj = z
      .object({
        potName: this.getPotNameSchema(potNames),
        // When edit Pot - target(forecast cash destination) can not be less than total(saved cash in pot)
        target: this.getCommonCashNumberSchema(potTotal),
      })
      .safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Add Pot");
    }
    return validationObj;
  }

  public validateTotal(
    additionalAmount: string,
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

  public validateAddBudgetSchema(formData: IAddBudgetValidationData) {
    const validationObj = this.addBudgetSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Add Budget");
    }

    return validationObj;
  }

  public validateRegisterSchema(
    formData: IRegisterValidationData,
  ): z.ZodSafeParseResult<IRegisterValidationData> {
    const validationObj = this.registerFormSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Register");
    }

    return validationObj as z.ZodSafeParseResult<IRegisterValidationData>;
  }

  public validateSignInSchema(
    formData: ISignInValidationData,
  ): z.ZodSafeParseResult<ISignInValidationData> {
    const validationObj = this.signInFormSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Sign In");
    }

    return validationObj as z.ZodSafeParseResult<ISignInValidationData>;
  }

  public validateAuthSchema(
    formData: { email: string; password: string; name?: string },
    schema: "signin" | "register",
  ): z.ZodSafeParseResult<{ email: string; password: string; name?: string }> {
    let validationObj;

    if (schema === "signin") {
      validationObj = this.signInFormSchema.safeParse({
        email: formData.email,
        password: formData.password,
      });
    } else {
      validationObj = this.registerFormSchema.safeParse(formData);
    }

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, schema === "signin" ? "Sign In" : "Register");
    }

    return validationObj as z.ZodSafeParseResult<{
      email: string;
      password: string;
      name?: string;
    }>;
  }

  public validateCreateTransactionSchema(
    formData: ICreateTransactionValidationData,
  ): z.ZodSafeParseResult<ICreateTransactionValidationData> {
    const validationObj =
      this.createTransactionFormDataSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(validationObj.error, "Create Transaction");
    }

    return validationObj as unknown as z.ZodSafeParseResult<ICreateTransactionValidationData>;
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

  public createCustomZodIssueResult<T = string>(
    propName: string,
    message: string,
    mockValue?: T,
  ): z.ZodSafeParseError<T> {
    const schema = z.any().superRefine((_, ctx) => {
      ctx.addIssue({
        code: "custom",
        message,
        path: [propName],
      });
    });

    const result = schema.safeParse(mockValue ?? "");
    return result as z.ZodSafeParseError<T>;
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
