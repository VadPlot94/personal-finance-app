import "server-only";

import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import authService from "@/back-end/DAL/db-services/auth.service";
import { AuthMode } from "@/shared/services/constants.service";

class AuthController extends BaseController {
  public async registerUser(
    credentials: unknown,
  ): Promise<ValidationResponse<Partial<User> | null>> {
    return await this.validationObjectWrapper<Partial<User> | null>(
      "create",
      async () =>
        authService.authUser(
          AuthMode.Register,
          credentials as unknown as
            | Partial<Record<"name" | "email" | "password", unknown>>
            | undefined,
        ),
      { requireAuth: false },
    );
  }

  /**
   * Authorization for login (not register).
   * Wraps with validationObjectWrapper (requireAuth: false) for error logging.
   */
  public async autorizeUser(
    credentials: Partial<Record<"email" | "password", unknown>> | undefined,
  ): Promise<ValidationResponse<Partial<User> | null>> {
    return await this.validationObjectWrapper<Partial<User> | null>(
      "get",
      async () => authService.authUser(AuthMode.SignIn, credentials),
      { requireAuth: false },
    );
  }

  /** RSC helper: redirects to /login when unauthenticated. */
  public async ensureSession(): Promise<Session> {
    return authService.getSessionOrRedirectToLoginPage();
  }

  /** RSC helper for login page: returns session if authenticated, otherwise null. */
  public async getOptionalSession(): Promise<Session | null> {
    try {
      return await authService.getAuthenticatedSession();
    } catch {
      return null;
    }
  }

  /** True when the current session user was persisted as admin (User.isAdmin). */
  public async isAdminSession(): Promise<boolean> {
    try {
      const session = await authService.getAuthenticatedSession();
      return Boolean(session.user?.isAdmin);
    } catch {
      return false;
    }
  }
}

const authController = new AuthController();
export default authController;
