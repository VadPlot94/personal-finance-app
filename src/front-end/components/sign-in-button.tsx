"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export default function SignInButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <button
        type="button"
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
