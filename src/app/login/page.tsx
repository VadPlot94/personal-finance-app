import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ILoginPageProps } from "@/app/login/types";
import authController from "@/back-end/controllers/auth-controller";
import LoginForm from "@/front-end/components/login/login-form";
import constants from "@/shared/services/constants.service";

async function LoginRedirectIfAuthenticated() {
  const session = await authController.getOptionalSession();
  if (session?.user?.id) {
    redirect(constants.AppRoutes.overview);
  }
  return null;
}

export default async function LoginPage({ searchParams }: ILoginPageProps) {
  const { authMode } = await searchParams;

  return (
    <>
      <Suspense fallback={null}>
        <LoginRedirectIfAuthenticated />
      </Suspense>
      <LoginForm authMode={authMode} />
    </>
  );
}
