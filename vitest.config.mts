import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.tests.{ts,tsx}"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "./coverage/junit.xml",
    },
    coverage: {
      provider: "v8",
      reporter: [
        "text",
        "html",
        "lcov",
        "cobertura",
        "json",
        "json-summary",
      ],
      reportsDirectory: "./coverage",
      // Business logic only — pages/UI would drown the MR percentage.
      include: [
        "src/shared/services/**/*.{ts,tsx}",
        "src/front-end/services/**/*.{ts,tsx}",
        "src/back-end/mappers/**/*.{ts,tsx}",
        "src/back-end/common/**/*.{ts,tsx}",
        "src/back-end/controllers/**/*.{ts,tsx}",
        "src/back-end/DAL/**/*.{ts,tsx}",
        "src/lib/utils.ts",
      ],
      exclude: [
        "src/**/*.tests.{ts,tsx}",
        "src/**/types.ts",
        "src/**/test-utils/**",
        "src/**/dto-model-types/**",
        // shadcn / installed UI kit — not app-owned; do not cover or unit-test
        "src/front-end/components/ui/**",
      ],
    },
  },
});
