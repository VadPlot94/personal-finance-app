import constants, { AuthMode } from "@/shared/services/constants.service";

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

  public async signOut(
    callbackUrl: string = constants.AppRoutes.home,
  ): Promise<void> {
    // Dynamic import: this module is also used from RSC (login page).
    // A top-level next-auth/react import would pull client-only code into the server bundle.
    const { signOut } = await import("next-auth/react");
    await signOut({
      callbackUrl,
      redirect: true,
    });
  }
}

const authService = new AuthService();
export default authService;
