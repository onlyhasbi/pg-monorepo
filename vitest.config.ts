import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "@repo/config": new URL("./packages/config/src", import.meta.url).pathname,
      "@repo/constant": new URL("./packages/constant/src", import.meta.url).pathname,
      "@repo/hooks": new URL("./packages/hooks/src", import.meta.url).pathname,
      "@repo/lib": new URL("./packages/lib/src", import.meta.url).pathname,
      "@repo/schemas": new URL("./packages/schemas/src", import.meta.url).pathname,
      "@repo/services": new URL("./packages/services/src", import.meta.url).pathname,
      "@repo/types": new URL("./packages/types/src", import.meta.url).pathname,
      "@repo/ui": new URL("./packages/ui/src", import.meta.url).pathname
    },
    projects: [
      "apps/*",
      {
        test: {
          include: ["packages/**/__tests__/**/*.test.ts"],
          environment: "node",
          globals: true,
        },
      },
    ],
  },
});
