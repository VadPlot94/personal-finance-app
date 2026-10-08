import "server-only";

export type ServerActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string | null | undefined;
  zodErrors?: Record<string, string>;
  message?: string;
};

export interface IValidationResult {
  isValid: boolean;
  error?: string | null | undefined;
  errors?: Record<string, string>;
}
