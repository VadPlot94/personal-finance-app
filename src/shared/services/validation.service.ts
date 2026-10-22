import type { Pot } from "@prisma/client";
import { z } from "zod";
import constants, {
  AuthMode,
  type Theme,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import logger from "@/shared/services/logger.service";
import translationService from "@/shared/services/translation.service";
import type {
  IAddBudgetValidationData,
  ICreatePotValidationData,
  ICreateTransactionValidationData,
  IRegisterValidationData,
  ISignInValidationData,
} from "@/shared/services/types";

class ValidationService {
  private addBudgetSchema = z.object({
    maximum: this.getCommonCashNumberSchema(0),
  });

  private registerFormSchema = z.object({
    email: z.string().email("i18n.Validation.InvalidEmail"),
    password: z.string().min(6, "i18n.Validation.PasswordMinLength"),
    name: z.string().min(1, "i18n.Validation.NameRequired"),
  });

  private signInFormSchema = z.object({
    email: z.string().email("i18n.Validation.InvalidEmail"),
    password: z.string().min(1, "i18n.Validation.PasswordRequired"),
  });

  private createTransactionFormDataSchema = z.object({
    transactionType: z
      .enum(Object.values(TransactionType))
      .optional()
      .refine((val) => !!val, {
        message: "i18n.Validation.SelectTransactionType",
      }),

    category: z
      .enum(
        Object.values(TransactionUICategory).filter(
          (c) => c !== TransactionUICategory.AllTransactions,
        ),
      )
      .optional()
      .refine((val) => !!val, {
        message: "i18n.Validation.SelectCategory",
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
          .min(1, {
            message: "i18n.Validation.DateRequired",
          })
          .refine((val) => !Number.isNaN(Date.parse(val)), {
            message: "i18n.Validation.InvalidDate",
          })
          .transform((val) => new Date(val))
          .refine((date) => date <= new Date(), {
            message: "i18n.Validation.DateInFuture",
          })
          .refine(
            (date) => {
              const minDate = new Date();
              minDate.setFullYear(minDate.getFullYear() - 15);
              return date >= minDate;
            },
            {
              message: "i18n.Validation.DateTooOld",
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
    schema: AuthMode,
  ): z.ZodSafeParseResult<{ email: string; password: string; name?: string }> {
    const validationObj: z.ZodSafeParseResult<{
      email: string;
      password: string;
      name?: string;
    }> =
      schema === AuthMode.SignIn
        ? this.signInFormSchema.safeParse({
            email: formData.email,
            password: formData.password,
          })
        : this.registerFormSchema.safeParse(formData);

    if (validationObj.error) {
      this.logZodErrors(
        validationObj.error,
        schema === AuthMode.SignIn ? "Sign In" : "Register",
      );
    }

    return validationObj;
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
    return result.error.issues.reduce<Partial<Record<keyof T, string>>>(
      (errors, issue) => {
        const path = issue.path[0] as keyof T;
        if (!errors[path]) {
          errors[path] = validationService.getZodIssueErrorMessage(issue);
        }
        return errors;
      },
      {},
    );
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
            message: "i18n.Validation.InvalidCash",
          })
          .refine(
            (val) => {
              const num = Number(val);
              return !Number.isNaN(num);
            },
            {
              message: "i18n.Validation.InvalidNumber",
            },
          )
          .refine(
            (val) => {
              return Number(val) >= (minValue || 0);
            },
            {
              message: translationService.joinKeyWithParams(
                "i18n.Validation.ValueLessThanTotal",
                { minValue: minValue || 0 },
              ),
            },
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
            message: "i18n.Validation.NameMinLength",
          })
          .max(constants.MaxPotNameCharacters, {
            message: translationService.joinKeyWithParams(
              "i18n.Validation.NameTooLong",
              {
                max: constants.MaxPotNameCharacters,
              },
            ),
          })
          .regex(/^[a-zA-Z0-9\s\-_]+$/, {
            message: "i18n.Validation.NameInvalidChars",
          })
          .refine((val) => !excludedNames?.includes(val), {
            message: "i18n.Validation.ValueAlreadyExists",
          }),
      );
  }

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
        message: translationService.joinKeyWithParams(
          "i18n.Validation.ExceedsBalance",
          {
            balance: currentBalance,
          },
        ),
      })
      .refine((val) => Number(val) + oldTotal <= target, {
        message: translationService.joinKeyWithParams(
          "i18n.Validation.ExceedsTarget",
          {
            target,
          },
        ),
      });
  }

  private logZodErrors(error: z.ZodError, context: string) {
    error.issues.forEach((issue) => {
      const path = issue.path.join(".") || "root";
      const message = this.getZodIssueErrorMessage(issue, {
        translateForLogs: true,
      });
      logger.logError(
        `[${context}] Validation failed at "${path}": ${issue.code} - ${message}`,
      );
    });
  }

  private getZodIssueErrorMessage(
    issue: z.core.$ZodIssue,
    options?: { translateForLogs?: boolean },
  ) {
    const resolveMessage = (
      rawMessage: string | null | undefined,
    ): string | null => {
      if (!rawMessage) {
        return null;
      }
      return options?.translateForLogs
        ? translationService.translateToDefaultLocale(rawMessage)
        : rawMessage;
    };

    let message = Array.isArray(issue.message)
      ? issue.message.map(resolveMessage).filter(Boolean).join(", ")
      : (resolveMessage(issue.message) ?? "");
    const innerErrors = (issue as { errors: z.core.$ZodIssue[] })?.errors
      ?.flat()
      ?.map((innerIssue: z.core.$ZodIssue) =>
        resolveMessage(innerIssue?.message),
      )
      ?.filter(Boolean)
      ?.join(", ");
    if (innerErrors) {
      message += `: ${innerErrors}`;
    }
    return message;
  }
}

const validationService = new ValidationService();
export default validationService;
