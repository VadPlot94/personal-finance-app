"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { registerUserSRF } from "@/back-end/server-actions/auth-actions";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import type { ILoginFormProps } from "@/front-end/components/login/types";
import { Button } from "@/front-end/components/ui/button";
import { Input } from "@/front-end/components/ui/input";
import { Label } from "@/front-end/components/ui/label";
import type {
  IRegisterFormData,
  IRegisterValidationData,
  ISignInFormData,
  ISignInValidationData,
} from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

export enum AuthMode {
  SignIn = "signin",
  Register = "register",
}

function resolveAuthMode(authMode?: string): AuthMode {
  if (authMode && Object.values(AuthMode).includes(authMode as AuthMode)) {
    return authMode as AuthMode;
  }
  return AuthMode.SignIn;
}

// Transform and set sign in form data
function getSignInFormData(
  data?: Partial<ISignInFormData> | null,
): ISignInFormData | null {
  return data
    ? {
        email: data.email || "",
        password: data.password || "",
      }
    : null;
}

// Transform and set register form data
function getRegisterFormData(
  data?: Partial<IRegisterFormData> | null,
): IRegisterFormData | null {
  return data
    ? {
        email: data.email || "",
        password: data.password || "",
        name: data.name || "",
      }
    : null;
}

function isSignInFormValid(
  signInErrors: Partial<Record<keyof ISignInValidationData, string>> | null,
  formSignInData: ISignInFormData | null,
) {
  return !signInErrors && formSignInData?.email && formSignInData?.password;
}

function isRegisterFormValid(
  registerErrors: Partial<Record<keyof IRegisterValidationData, string>> | null,
  formRegisterData: IRegisterFormData | null,
) {
  return (
    !registerErrors &&
    formRegisterData?.name &&
    formRegisterData?.email &&
    formRegisterData?.password
  );
}

function getSignInFormErrors(
  formData: ISignInFormData,
): Partial<Record<keyof ISignInValidationData, string>> | null {
  const result = validationService.validateAuthSchema(formData, "signin");

  if (result.success) {
    return null;
  }
  return validationService.createErrorsWithPath<Partial<ISignInValidationData>>(
    result,
  );
}

function getRegisterFormErrors(
  formData: IRegisterFormData,
): Partial<Record<keyof IRegisterValidationData, string>> | null {
  const result = validationService.validateAuthSchema(formData, "register");

  if (result.success) {
    return null;
  }
  return validationService.createErrorsWithPath<
    Partial<IRegisterValidationData>
  >(result);
}

export default function LoginForm({
  isLoading = false,
  authMode,
}: ILoginFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [authFormMode, setAuthFormMode] = useState<AuthMode>(() =>
    resolveAuthMode(authMode),
  );

  // Redirect to overview if already logged in
  useEffect(() => {
    if (session?.user?.id) {
      router.push("/overview");
    }
  }, [session?.user?.id, router]);

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, {
      redirect: true,
      redirectTo: "/overview",
    });
  };

  // Sign In State
  const [formSignInData, setFormSignInStateData] =
    useState<ISignInFormData | null>(() => getSignInFormData(null));
  const [signInErrors, setSignInErrors] = useState<Partial<
    Record<keyof ISignInValidationData, string>
  > | null>(() => null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Register State
  const [formRegisterData, setFormRegisterStateData] =
    useState<IRegisterFormData | null>(() => getRegisterFormData(null));
  const [registerErrors, setRegisterErrors] = useState<Partial<
    Record<keyof IRegisterValidationData, string>
  > | null>(() => null);

  useEffect(() => {
    if (formSignInData) {
      setSignInErrors(getSignInFormErrors(formSignInData));
    }
  }, [formSignInData]);

  useEffect(() => {
    if (formRegisterData) {
      setRegisterErrors(getRegisterFormErrors(formRegisterData));
    }
  }, [formRegisterData]);

  const handleAutoLogin = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Registration successful, but login failed");
      return;
    }

    router.push("/overview");
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);
    setSignInErrors(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: formSignInData?.email || "",
      password: formSignInData?.password || "",
    });

    setIsSigningIn(false);

    if (result?.error) {
      setSignInErrors({ email: "Invalid credentials" });
      return;
    }

    router.push("/overview");
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setRegisterErrors(null);

    const response = await registerUserSRF({
      email: formRegisterData?.email || "",
      password: formRegisterData?.password || "",
      name: formRegisterData?.name || "",
    });

    if (response.success) {
      toast.success("Account created successfully");
      await handleAutoLogin(
        formRegisterData?.email || "",
        formRegisterData?.password || "",
      );
      setFormRegisterStateData(getRegisterFormData(null));
    } else {
      if (response.zodErrors) {
        setRegisterErrors(response.zodErrors);
      } else {
        toast.error("Registration failed", {
          description: response.error || "Please try again",
        });
      }
    }
  };

  const handleAuthFormToggleClick = (newAuthMode: AuthMode) => {
    if (authFormMode === newAuthMode) {
      return;
    }
    setAuthFormMode(newAuthMode);
    if (newAuthMode === AuthMode.SignIn) {
      setSignInErrors(null);
      setFormSignInStateData(getSignInFormData(null));
    } else if (newAuthMode === AuthMode.Register) {
      setRegisterErrors(null);
      setFormRegisterStateData(getRegisterFormData(null));
    }
  };

  const showLoading = isLoading || Boolean(session?.user?.id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <ItemCard className="w-full max-w-md">
        <EmptyContentWrapper isLoading={showLoading} hasItems={!showLoading}>
          {/* Tab Toggle */}
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => handleAuthFormToggleClick(AuthMode.SignIn)}
              type="button"
              className={`pb-3 font-bold text-3xl transition-colors cursor-pointer ${
                authFormMode === AuthMode.SignIn
                  ? "border-b-2 border-black text-black"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => handleAuthFormToggleClick(AuthMode.Register)}
              type="button"
              className={`pb-3 font-bold text-3xl transition-colors cursor-pointer ${
                authFormMode === AuthMode.Register
                  ? "border-b-2 border-black text-black"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Sign In Form */}
          {authFormMode === "signin" && (
            <form onSubmit={handleSignIn}>
              <div className="flex flex-col gap-5">
                <div className="text-app-color text-xs">
                  Sign in to your account to access your personal finance
                  dashboard.
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="signin-email"
                    className="text-app-color text-xs font-bold"
                  >
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    className="border-gray-300"
                    value={formSignInData?.email || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormSignInStateData(
                        getSignInFormData({
                          ...formSignInData,
                          email: e.target.value,
                        }),
                      )
                    }
                    placeholder="admin@example.com"
                  />
                  <p className="text-xs text-red-500">{signInErrors?.email}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="signin-password"
                    className="text-app-color text-xs font-bold"
                  >
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    className="border-gray-300"
                    value={formSignInData?.password || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormSignInStateData(
                        getSignInFormData({
                          ...formSignInData,
                          password: e.target.value,
                        }),
                      )
                    }
                    placeholder="please enter password"
                  />
                  <p className="text-xs text-red-500">
                    {signInErrors?.password}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={
                      isSigningIn ||
                      !isSignInFormValid(signInErrors, formSignInData)
                    }
                    className="w-full h-12 cursor-pointer"
                  >
                    {isSigningIn ? "Signing in..." : "Sign in"}
                  </Button>
                  <Button
                    type="button"
                    disabled={isSigningIn}
                    onClick={() => handleOAuthSignIn("google")}
                    variant="outline"
                    className="w-full h-12 cursor-pointer"
                  >
                    Continue with Gmail
                  </Button>
                  <Button
                    type="button"
                    disabled={isSigningIn}
                    onClick={() => handleOAuthSignIn("github")}
                    variant="outline"
                    className="w-full h-12 cursor-pointer"
                  >
                    Continue with GitHub
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Register Form */}
          {authFormMode === "register" && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="flex flex-col gap-5">
                <div className="text-app-color text-xs">
                  Create a new account to start managing your personal finances.
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="register-name"
                    className="text-app-color text-xs font-bold"
                  >
                    Name
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    className="border-gray-300"
                    value={formRegisterData?.name || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormRegisterStateData(
                        getRegisterFormData({
                          ...formRegisterData,
                          name: e.target.value,
                        }),
                      )
                    }
                    placeholder="John Doe"
                  />
                  <p className="text-xs text-red-500">{registerErrors?.name}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="register-email"
                    className="text-app-color text-xs font-bold"
                  >
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    className="border-gray-300"
                    value={formRegisterData?.email || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormRegisterStateData(
                        getRegisterFormData({
                          ...formRegisterData,
                          email: e.target.value,
                        }),
                      )
                    }
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-red-500">
                    {registerErrors?.email}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="register-password"
                    className="text-app-color text-xs font-bold"
                  >
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    className="border-gray-300"
                    value={formRegisterData?.password || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormRegisterStateData(
                        getRegisterFormData({
                          ...formRegisterData,
                          password: e.target.value,
                        }),
                      )
                    }
                    placeholder="at least 6 characters"
                  />
                  <p className="text-xs text-red-500">
                    {registerErrors?.password}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={
                      !isRegisterFormValid(registerErrors, formRegisterData)
                    }
                    className="w-full h-12 cursor-pointer"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </form>
          )}
        </EmptyContentWrapper>
      </ItemCard>
    </div>
  );
}
