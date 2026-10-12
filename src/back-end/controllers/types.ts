export type ValidationResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string | null | undefined;
  zodErrors?: Record<string, string>;
  message?: string;
};
