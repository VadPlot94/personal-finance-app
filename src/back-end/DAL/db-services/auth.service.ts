import "server-only";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { CustomError } from "@/back-end/common/errors";
import { authEnv } from "@/back-end/config/auth-env";
import userService from "@/back-end/DAL/db-services/user.service";
import { setTestAppData } from "@/back-end/prisma/seed";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";
import { auth } from "@/lib/auth";
import validationService from "@/shared/services/validation.service";

class AuthService {
  public async authUser(
    action: "register" | "signin",
    credentials:
      | Partial<Record<"email" | "password" | "name", unknown>>
      | undefined,
  ): Promise<Partial<User> | null> {
    const validCredentials = this.getValidCredentials(credentials, action);
    if (!validCredentials) {
      return null;
    }
    if (action === "register") {
      return await this.registerUser(validCredentials);
    } else if (action === "signin") {
      return await this.authorizeUser(validCredentials);
    }
    return null;
  }

  private async authorizeUser(validCredentials: {
    email: string;
    password: string;
    name?: string;
  }): Promise<Partial<User> | null> {
    const { email, password } = validCredentials;

    // 1) Try normal credentials login (email + password against DB hash)
    const user = await userService.getUser(email, password);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user?.name ?? user.email,
      };
    }

    // 2) getUser is null for missing user OR wrong password — only continue
    //    bootstrap if the typed pair matches AUTH_EMAIL / AUTH_PASSWORD from env
    if (!this.isAdminUser(email, password)) {
      return null;
    }

    // 3) Admin env creds matched, but a user with this email already exists:
    //    password did not verify — do not upsert/reset password or re-seed
    const existingAdmin = await userService.findByEmail(email);
    if (existingAdmin) {
      return null;
    }

    // 4) Create admin user on first login if credentials match and no user exists
    const admin = await userService.createUser(
      email,
      password,
      email.split("@")[0] ?? email,
    );
    // 5) Fill database with test data on first admin create
    //    so we can test app features without manual adding data after each reset
    await setTestAppData(admin.id);
    return {
      id: admin.id,
      email: admin.email,
      name: admin?.name ?? admin.email,
    };
  }

  private async registerUser(validCredentials: {
    email: string;
    password: string;
    name?: string;
  }): Promise<Partial<User>> {
    const { email, password, name } = validCredentials;
    // name is guaranteed to be non-empty by Zod schema validation
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User with this email already exists");
    }
    const user = await userService.createUser(email, password, name!);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  public getValidCredentials(
    credentials: Record<string, unknown> | undefined,
    schema: "signin" | "register",
  ): { email: string; password: string; name?: string } | null {
    const email =
      typeof credentials?.email === "string"
        ? credentials.email.trim()
        : undefined;
    const password =
      typeof credentials?.password === "string"
        ? credentials.password
        : undefined;
    const name =
      typeof credentials?.name === "string" ? credentials.name : undefined;

    if (!email || !password) {
      return null;
    }

    // Validate credentials using validation service
    const validationResult = validationService.validateAuthSchema(
      { email, password, name },
      schema,
    );

    if (!validationResult.success) {
      return null;
    }

    return { email, password, name };
  }

  public async getSessionOrRedirectToLoginPage() {
    const session = await this.getAppSession();

    if (!session?.user?.id) {
      redirect("/login");
    }

    return session;
  }

  /**
   * Returns the current authenticated session.
   * Throws `CustomError("Unauthorized")` if the user is not authenticated.
   * Use `session.user.id` to obtain the current user's id for user-scoped
   * operations (get/update/delete) to restrict access to the user's data.
   * @returns {Session} session object containing user information
   * @throws {CustomError} when the user is not authenticated
   */
  public async getAuthenticatedSession(): Promise<Session> {
    const session = await this.getAppSession();

    if (!session?.user?.id) {
      throw new CustomError("Unauthorized");
    }

    return session;
  }

  private async getAppSession() {
    return auth();
  }

  /**
   * Authorization method called when the user logs in (not register).
   * Wraps with validationObjectWrapper (requireAuth: false) for error logging.
   * @returns ServerActionResult with user data if valid, otherwise null data
   */
  public async autorizeUser(
    credentials: Partial<Record<"email" | "password", unknown>> | undefined,
  ): Promise<ServerActionResult<Partial<User> | null>> {
    return validationObjectWrapper<Partial<User> | null>(
      "get",
      async () => this.authUser("signin", credentials),
      { requireAuth: false },
    );
  }

  public isAdminUser(
    email: string | undefined,
    password: string | undefined,
  ): boolean {
    const { email: adminEmail, password: adminPassword } = authEnv;
    return email === adminEmail && password === adminPassword;
  }
}

const authService = new AuthService();
export default authService;
