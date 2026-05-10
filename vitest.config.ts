import { defineConfig } from "vitest/config";

// Component unit tests via Vitest + happy-dom.
// Storybook story tests live in apps/storybook/vitest.config.ts (browser mode + Playwright).
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.tsx",
        "src/index.ts",
        "src/navigation/_app-icons/**",
      ],
    },
  },
});
