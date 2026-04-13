import { ServerActionResult } from "./types";

export class CustomError extends Error {
  public isCustomError = true as const;
  public readonly isZodError: boolean;

  constructor(
    public message: string,
    public zodErrors?: Record<string, string>,
  ) {
    super(message);
    this.isZodError = !!zodErrors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export async function validationObjectWrapper<T = unknown>(
  action: "get" | "update" | "delete" | "create",
  callback: () => Promise<T>,
): Promise<ServerActionResult<T>> {
  try {
    const response = await callback();
    return {
      success: true,
      data: response,
      message: `Data ${action} successfully`,
    };
  } catch (error) {
    console.error(`Error when ${action} data:`, error);
    if (error instanceof CustomError) {
      if (error.isZodError) {
        return {
          success: false,
          error: "Validation error",
          zodErrors: error.zodErrors,
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: `Failed to ${action} data. Please try again.`,
    };
  }
}
