import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { Session } from "next-auth";
import { CustomError } from "@/back-end/server-actions/common";

class AuthService {
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
    return getServerSession(authOptions);
  }
}

const authService = new AuthService();
export default authService;
