"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/back-end/server-actions/auth-actions";
import { IRegisterValidationData } from "@/shared/services/types";
import { toast } from "sonner";

export default function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formErrors, setFormErrors] = useState<Partial<
    Record<keyof IRegisterValidationData, string>
  > | null>(null);

  const handleAutoLogin = async () => {
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
    setSignInError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsSigningIn(false);

    if (result?.error) {
      setSignInError("Invalid credentials");
      return;
    }

    router.push("/overview");
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormErrors(null);
    setIsRegistering(true);

    const response = await registerUser({
      email,
      password,
      name,
    });

    setIsRegistering(false);

    if (response.success) {
      toast.success("Account created successfully");
      await handleAutoLogin();
    } else {
      if (response.zodErrors) {
        setFormErrors(response.zodErrors);
      } else {
        toast.error("Registration failed", {
          description: response.error || "Please try again",
        });
      }
    }
  };

  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">You are signed in</h1>
          <div className="mb-4 text-sm text-slate-600">
            Signed in as {session.user?.name || session.user?.email}
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        {/* Tab Toggle */}
        <div className="mb-6 flex gap-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setSignInError(null);
            }}
            className={`pb-3 font-medium transition-colors ${
              mode === "signin"
                ? "border-b-2 border-black text-black"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setFormErrors(null);
            }}
            className={`pb-3 font-medium transition-colors ${
              mode === "register"
                ? "border-b-2 border-black text-black"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Sign In Form */}
        {mode === "signin" && (
          <form
            onSubmit={handleSignIn}
            className="space-y-6 rounded-3xl bg-white p-8 shadow-xl"
          >
            <h1 className="text-3xl font-semibold">Sign in</h1>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="password"
              />
            </div>
            {signInError && (
              <p className="text-sm text-red-600">{signInError}</p>
            )}
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
            >
              {isSigningIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form
            onSubmit={handleRegisterSubmit}
            className="space-y-6 rounded-3xl bg-white p-8 shadow-xl"
          >
            <h1 className="text-3xl font-semibold">Create Account</h1>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="John Doe"
              />
              {formErrors?.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="your@email.com"
              />
              {formErrors?.email && (
                <p className="text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="at least 6 characters"
              />
              {formErrors?.password && (
                <p className="text-xs text-red-600">{formErrors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
            >
              {isRegistering ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
