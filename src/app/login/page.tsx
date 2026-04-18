import { redirect } from "next/navigation";
import authService from "@/back-end/DAL/db-services/auth.service";
import LoginForm from "./login-form";

export default async function LoginPage() {
  try {
    const session = await authService.getAuthenticatedSession();
    if (session?.user?.id) {
      redirect("/overview");
    }
  } catch {
    // Not authenticated, continue to login page
  }

  return <LoginForm />;
}
