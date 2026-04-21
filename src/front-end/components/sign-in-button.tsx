"use client";

import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";
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
        {constants.SignOutMenuItemConfig.title}
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
