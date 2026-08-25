import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkgRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export default defineConfig({
  root: path.dirname(fileURLToPath(import.meta.url)),
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@tmi-packages/ui": path.join(pkgRoot, "src/index.ts"),
      "@tmi-packages/ui/table": path.join(pkgRoot, "src/DataTable/index.ts"),
      "@tmi-packages/ui/autocomplete": path.join(
        pkgRoot,
        "src/AutocompleteSelect/index.ts",
      ),
    },
  },
});
