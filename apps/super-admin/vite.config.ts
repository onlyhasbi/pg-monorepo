import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    nitro({
      preset: "vercel",
      rollupConfig: {
        onwarn(warning, warn) {
          if (
            (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) ||
            (warning.code === "UNKNOWN_OPTION" && warning.message.includes("platform"))
          ) {
            return;
          }
          warn(warning);
        },
      },
      routeRules: {
        "/api-proxy/**": { proxy: "https://publicgold.co.id/**" },
        "/api-proxy-my/**": { proxy: "https://publicgold.com.my/**" }
      }
    }),
    viteReact(),
    tailwindcss(),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    modulePreload: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) ||
          (warning.code === "UNKNOWN_OPTION" && warning.message.includes("platform"))
        ) {
          return;
        }
        warn(warning);
      },
    },
  },

  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      "/api-proxy": {
        target: "https://publicgold.co.id",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
      },
      "/api-proxy-my": {
        target: "https://publicgold.com.my",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy-my/, ""),
      },
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@repo/lib": path.resolve(__dirname, "../../packages/lib/src"),
      "@repo/hooks": path.resolve(__dirname, "../../packages/hooks/src"),
      "@repo/schemas": path.resolve(__dirname, "../../packages/schemas/src"),
      "@repo/constant": path.resolve(__dirname, "../../packages/constant/src"),
      "@repo/services": path.resolve(__dirname, "../../packages/services/src"),
      "@repo/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@repo/config": path.resolve(__dirname, "../../packages/config/src"),
      "@/components": path.resolve(__dirname, "../../packages/ui/src"),
      "@/lib": path.resolve(__dirname, "../../packages/lib/src"),
      "@/hooks": path.resolve(__dirname, "../../packages/hooks/src"),
      "@/schemas": path.resolve(__dirname, "../../packages/schemas/src"),
      "@/constant": path.resolve(__dirname, "../../packages/constant/src"),
      "@/services": path.resolve(__dirname, "../../packages/services/src"),
      "@/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
    },
    conditions: ["import", "module", "browser", "default"],
  },
});
