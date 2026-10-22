import { AuthMode } from "@/shared/services/constants.service";

class AuthService {
  public getValidAuthMode(authMode?: string): AuthMode {
    const resolvedAuthMode = (
      typeof authMode === "string"
        ? decodeURIComponent(authMode)
        : AuthMode.SignIn
    ) as AuthMode;
    return Object.values(AuthMode).includes(resolvedAuthMode)
      ? resolvedAuthMode
      : AuthMode.SignIn;
  }
}

const authService = new AuthService();
export default authService;
