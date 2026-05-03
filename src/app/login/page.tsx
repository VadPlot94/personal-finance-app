import { redirect } from "next/navigation";
import { Suspense } from "react";
import authService from "@/back-end/DAL/db-services/auth.service";
import LoginForm from "@/front-end/components/login/login-form";

export default async function LoginPage() {
  try {
    const session = await authService.getAuthenticatedSession();
    if (session?.user?.id) {
      redirect("/overview");
    }
  } catch {
    // Not authenticated, continue to login page
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
