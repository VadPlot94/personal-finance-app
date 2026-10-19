"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AuthMode } from "@/front-end/components/login/login-form";
import constants from "@/shared/services/constants.service";

export default function CreateAccountLink() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const registerHref = `${constants.AppRoutes.login}?authMode=${AuthMode.Register}`;

  if (status === "loading") {
    return (
      <Link href={registerHref} className="hover:text-slate-900">
        {t("i18n.LoginPage.CreateAccount")}
      </Link>
    );
  }

  if (session) {
    return (
      <span
        className="text-gray-400 cursor-not-allowed"
        title={t("i18n.LoginPage.AlreadySignedIn")}
      >
        {t("i18n.LoginPage.CreateAccount")}
      </span>
    );
  }

  return (
    <Link href={registerHref} className="hover:text-slate-900">
      {t("i18n.LoginPage.CreateAccount")}
    </Link>
  );
}
