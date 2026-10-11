import type { Metadata } from "next";
// This fonts will load on build time and we get it from server on app launch
// Place font in _next/static/css/...
// Without next/font we have to load fonts with <link> on app launch (Additional HTTP requests, FOIT, FOUT)
import { geistMono, publicSans } from "@/app/fonts";
import "./globals.css";
import Providers from "@/app/providers";
import type { IRootLayoutProps } from "@/app/types";
import NotificationBanner from "@/front-end/components/notification-banner/notification-banner";
import TestGlobalErrorButton from "@/front-end/components/test/test-global-error-button/test-global-error-button";

// ! Need to replace with Public_Sans font - Tailwind CSS default fonts. It is done in global.css

export const metadata: Metadata = {
  title: "Personal Finance App",
  description: "Personal Finance App",
};

export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        <TestGlobalErrorButton />
        <NotificationBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
