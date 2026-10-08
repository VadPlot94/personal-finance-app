import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getOptionalSessionServerAction } from "@/back-end/server-actions/auth-actions";
import LoginForm from "@/front-end/components/login/login-form";

export default async function LoginPage() {
  const session = await getOptionalSessionServerAction();
  if (session?.user?.id) {
    redirect("/overview");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
