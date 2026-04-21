"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { AuthMode } from "./login/login-form";

export default function CreateAccountLink() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Link href={`/login?authMode=${AuthMode.Register}`} className="hover:text-slate-900">
        Create Account
      </Link>
    );
  }

  if (session) {
    return (
      <span
        className="text-gray-400 cursor-not-allowed"
        title="You are already signed in"
      >
        Create Account
      </span>
    );
  }

  return (
    <Link href={`/login?authMode=${AuthMode.Register}`} className="hover:text-slate-900">
      Create Account
    </Link>
  );
}
