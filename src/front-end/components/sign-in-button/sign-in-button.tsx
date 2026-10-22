"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { ISignInButtonProps } from "@/front-end/components/sign-in-button/types";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export default function SignInButton({ className }: ISignInButtonProps) {
  const { data: session, status } = useSession();
  const t = useTranslations();

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
        {t("i18n.Navigation.SignOut")}
      </button>
    );
  }

  return (
    <Link
      href={constants.AppRoutes.login}
      prefetch={true}
      className={cn(
        "rounded-lg py-2 text-slate-700 hover:bg-slate-100",
        className,
      )}
    >
      {t("i18n.Navigation.SignIn")}
    </Link>
  );
}
