import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/shared/lib/path/content-path/**/*.ts",
        "src/shared/lib/date/format-date.ts",
        "src/shared/lib/resource/resource-state/**/*.ts",
        "src/shared/lib/async/detach-promise.ts",
        "src/shared/lib/monads/option/**/*.ts",
        "src/shared/lib/monads/result/**/*.ts",
        "src/features/file-tree/model/**/*.ts",
        "src/app/app-shell.model.ts",
      ],
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
