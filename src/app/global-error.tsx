"use client";

import { geistMono, publicSans } from "@/app/fonts";
import ErrorView from "@/front-end/components/error-view/error-view";
import type { IErrorViewProps } from "@/front-end/components/error-view/types";
import "./globals.css";

export default function GlobalError(props: IErrorViewProps) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        <title>Something went wrong | Personal Finance App</title>
        <ErrorView {...props} logArea="[global-error]" />
      </body>
    </html>
  );
}
