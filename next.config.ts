import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");

export default withNextIntl(nextConfig);
