import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    exposeTestingApiInProductionBuild:
      process.env.npm_lifecycle_event === "build:instant-nav",
  },
};

const withNextIntl = createNextIntlPlugin(
  "./src/i18n/nextIntlPlugin/requestI18nServerConfig.ts",
);

export default withNextIntl(nextConfig);
