"use client";

import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SignInButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className={cn(
          "rounded-lg py-2 text-slate-700 hover:bg-slate-100",
          className,
        )}
      >
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        "rounded-lg py-2 text-slate-700 hover:bg-slate-100",
        className,
      )}
    >
      Sign In
    </Link>
  );
}
