import { Geist_Mono, Public_Sans } from "next/font/google";

// Main font for all text in app
// Public_Sans({}) - load font, create it own variable --font-public-sans
// ${publicSans.variable} - will add CSS class that install font-family: var(--font-public-sans) on body
export const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: "variable", // full range of weights from 100 to 900
  style: ["normal", "italic"],
  display: "swap",
});

// Monospace font - for code blocks, logs, tables (<pre>, <code>, font-mono from Tailwind CSS)
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
