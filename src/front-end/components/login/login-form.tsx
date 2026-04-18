"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/back-end/server-actions/auth-actions";

export default function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push("/overview");
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await registerUser({
      email,
      password,
      name,
    });

    setIsLoading(false);

    if (!response.success) {
      setError(response.error || "Registration failed");
      return;
    }

    // Auto-login after successful registration
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Registration successful, but login failed");
      return;
    }

    router.push("/overview");
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
              setError(null);
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
              setError(null);
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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form
            onSubmit={handleRegister}
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
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
