import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import {
  CustomError,
  validationObjectWrapper,
} from "@/back-end/server-actions/common";
import constants from "@/shared/services/constants.service";
import userService from "./user.service";
import { User } from "@prisma/client";
import { setTestAppData } from "@/back-end/prisma/seed";
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
    let user = await userService.getUser(email, password);
    // Create admin user on first login if credentials match and no user exists
    if (!user && this.isAdminUser(email, password)) {
      user = await userService.createAdminUser(email, password);
      // Fill database with test data on first admin login if database is empty
      // so we can test app features without manual adding data after each reset
      await setTestAppData();
    }
    return user
      ? {
          id: user.id,
          email: user.email,
          name: user?.name ?? user.email,
        }
      : null;
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

  public async autorizeUser(
    credentials: Partial<Record<"email" | "password", unknown>> | undefined,
  ) {
    return await validationObjectWrapper<Partial<User> | null>(
      "get",
      async () => this.authUser("signin", credentials),
      { requireAuth: false },
    );
  }

  public isAdminUser(
    email: string | undefined,
    password: string | undefined,
  ): boolean {
    return email === constants.AuthEmail && password === constants.AuthPassword;
  }
}

const authService = new AuthService();
export default authService;
