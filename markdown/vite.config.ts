import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "plugin.js",
    },
    rollupOptions: {
      // Kept out of the bundle: ONLYOFFICE Apps supplies its own copies at load
      // time and rewrites these specifiers to them. A second React arrives with
      // its own contexts, so every SDK hook throws. The SDK root stays bundled
      // like any other dependency: string enums and types, no module state.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@onlyoffice/docspace-plugin-sdk/react",
        /^@docspace\/ui-kit(\/.*)?$/,
      ],
      output: {
        assetFileNames: (assetInfo: { name?: string }) =>
          assetInfo.name?.endsWith(".css") ? "plugin.css" : (assetInfo.name ?? "asset"),
      },
    },
  },
});
