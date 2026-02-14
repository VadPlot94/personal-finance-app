import { z } from "zod";
import logger from "./logger.service";
import constants from "./constants.service";

class ValidationService {
  private addPotNameSchema: z.ZodType<string> = z
    .string()
    .trim()
    .refine((val) => val !== "", { message: "" })
    .pipe(
      z
        .string()
        .min(3, { message: "The pot name must be at least 3 characters long" })
        .max(constants.MaxPotNameCharacters, {
          message: `The pot name is too long (max. ${constants.MaxPotNameCharacters} characters)`,
        })
        .regex(/^[a-zA-Z0-9\s\-_]+$/, {
          message:
            "Only letters, numbers, spaces, hyphens and underscores are allowed",
        }),
    );

  private addPotTargetSchema: z.ZodType<string> = z
    .string()
    .trim()
    .refine((val) => val !== "", { message: "" })
    .pipe(
      z.string().regex(/^[1-9]\d*$/, {
        message: "Please enter valid cash (only digits, no leading zero)",
      }),
    );
  public validateAddPotSchema(formData: any): z.ZodSafeParseResult<object> {
    return z
      .object({
        potName: this.addPotNameSchema,
        target: this.addPotTargetSchema,
      })
      .safeParse(formData);
  }

  public validatePotName(potName: string): z.ZodSafeParseResult<string> {
    const validationObj = this.addPotNameSchema.safeParse(potName);

    if (validationObj.error) {
      validationObj.error.issues.forEach((issue: z.core.$ZodIssue) => {
        logger.logError(
          `Pot name: '${potName}' -> ${issue.code}: ${issue.message}`,
        );
      });
    }

    return validationObj;
  }

  public validateTarget(target: number): z.ZodSafeParseResult<string> {
    const validationObj = this.addPotTargetSchema.safeParse(target);

    if (validationObj.error) {
      validationObj.error.issues.forEach((issue: z.core.$ZodIssue) => {
        logger.logError(
          `Target: '${target}' -> ${issue.code}: ${issue.message}`,
        );
      });
    }

    return validationObj;
  }
}

const validationService = new ValidationService();
export default validationService;
