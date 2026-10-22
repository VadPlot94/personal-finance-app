import { redirect } from "next/navigation";
import { Suspense } from "react";
import authController from "@/back-end/controllers/auth-controller";
import LoginForm from "@/front-end/components/login/login-form";
import authService from "@/front-end/services/auth.service";
import constants from "@/shared/services/constants.service";

async function LoginRedirectIfAuthenticated() {
  const session = await authController.getOptionalSession();
  if (session?.user?.id) {
    redirect(constants.AppRoutes.overview);
  }
  return null;
}

export default function LoginPage({
  searchParams,
}: PageProps<typeof constants.AppRoutes.login>) {
  return (
    <>
      <Suspense fallback={null}>
        <LoginRedirectIfAuthenticated />
      </Suspense>
      <Suspense fallback={<LoginForm isLoading />}>
        {(async () => {
          const params = await searchParams;
          const authMode = authService.getValidAuthMode(
            params.authMode as string,
          );
          return <LoginForm authMode={authMode} />;
        })()}
      </Suspense>
    </>
  );
}
