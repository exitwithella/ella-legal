import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/.source/**", "**/*.mdx"],
  },
  esbuild: {
    loader: "tsx",
  },
});
