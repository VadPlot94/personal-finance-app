import { z } from "zod";
import logger from "./logger.service";
import constants from "./constants.service";
import { IAddPotFormData } from "@/components/types";

class ValidationService {
  private getPotNameSchema(potNames: string[]): z.ZodType<string> {
    return z
      .string()
      .trim()
      .refine((val) => val !== "", { message: "" })
      .pipe(
        z
          .string()
          .min(3, {
            message: "The pot name must be at least 3 characters long",
          })
          .max(constants.MaxPotNameCharacters, {
            message: `The pot name is too long (max. ${constants.MaxPotNameCharacters} characters)`,
          })
          .regex(/^[a-zA-Z0-9\s\-_]+$/, {
            message:
              "Only letters, numbers, spaces, hyphens and underscores are allowed",
          })
          .refine((val) => !potNames.includes(val), {
            message: "Such Pot already exist",
          }),
      );
  }

  private getAddPotTargetSchema(potTotal: number | undefined): z.ZodType<string> {
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
          { message: "Target must be a valid number" },
        )
        .refine(
          (val) => {
            return Number(val) >= (potTotal || 0);
          },
          { message: `Target can not be less then total: ${potTotal || 0}` },
        ),
    );
  }

  private getTotalSchema(
    target: number,
    oldTotal: number,
    currentBalance: number,
  ) {
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
            { message: "Vale must be a valid number" },
          )
          .refine((val) => Number(val) + oldTotal <= currentBalance, {
            message: `Value cannot exceed 'Available Balance' (${currentBalance} $)`,
          })
          .refine((val) => Number(val) + oldTotal <= target, {
            message: `Value cannot exceed 'Target' (${target} $)`,
          }),
      );
  }

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
      validationObj.error.issues.forEach((issue) => {
        const path = issue.path.join(".") || "root";
        const code = issue.code;
        const message = Array.isArray(issue.message)
          ? issue.message.join(", ")
          : issue.message;

        logger.logError(`Validation failed at "${path}": ${code} - ${message}`);
      });
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
}

const validationService = new ValidationService();
export default validationService;
