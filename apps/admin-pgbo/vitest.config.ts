import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineProject({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@repo/lib": path.resolve(__dirname, "../../packages/lib/src"),
      "@repo/hooks": path.resolve(__dirname, "../../packages/hooks/src"),
      "@repo/schemas": path.resolve(__dirname, "../../packages/schemas/src"),
      "@repo/constant": path.resolve(__dirname, "../../packages/constant/src"),
      "@repo/services": path.resolve(__dirname, "../../packages/services/src"),
      "@repo/types": path.resolve(__dirname, "../../packages/types/src"),
      "@repo/config": path.resolve(__dirname, "../../packages/config/src"),
    },
  },
  test: {
    name: "admin-pgbo",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
  },
});
