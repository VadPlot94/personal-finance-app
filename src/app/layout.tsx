import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
// This fonts will load on build time and we get it from server on app launch
// Place font in _next/static/css/...
// Without next/font we have to load fonts with <link> on app launch (Additional HTTP requests, FOIT, FOUT)
import { geistMono, publicSans } from "@/app/fonts";
import "./globals.css";
import Providers from "@/app/providers";
import NotificationBanner from "@/front-end/components/notification-banner/notification-banner";
import TestGlobalErrorButton from "@/front-end/components/test/test-global-error-button/test-global-error-button";
import type constants from "@/shared/services/constants.service";
import translationService from "@/shared/services/translation.service";

// ! Need to replace with Public_Sans font - Tailwind CSS default fonts. It is done in global.css

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("i18n.Meta.Title"),
    description: t("i18n.Meta.Description"),
  };
}

export default function RootLayout({
  children,
}: LayoutProps<typeof constants.AppRoutes.home>) {
  return (
    <html lang={translationService.DefaultLocale}>
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Providers>
            <TestGlobalErrorButton />
            <NotificationBanner />
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
