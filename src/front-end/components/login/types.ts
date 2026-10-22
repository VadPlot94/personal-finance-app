import type { AuthMode } from "@/shared/services/constants.service";

export interface ILoginFormProps {
  isLoading?: boolean;
  authMode?: AuthMode;
}
