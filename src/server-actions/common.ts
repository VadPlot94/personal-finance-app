import { error } from "console";

export class CustomError extends Error {
  public isCustomError = true as const;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export async function validationObjectWrapper<T = unknown>(
  action: "get" | "update" | "delete",
  callback: () => Promise<T>,
) {
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
