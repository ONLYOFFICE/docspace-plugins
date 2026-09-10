import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const { name } = JSON.parse(readFileSync(`${__dirname}package.json`, "utf8"));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @kenjiuno/msgreader decodes MSG strings through iconv-lite, which reads Buffer
    // from Node's "buffer" module. In a browser build Vite would externalise that
    // builtin and the viewer would throw on the first .msg opened; the npm "buffer"
    // package is a drop-in implementation, so point the specifier at it.
    alias: {
      buffer: "buffer/",
    },
  },
  css: {
    // The emitted plugin.css is injected into DocSpace's own document, after its own
    // stylesheets - so a class the build did not hash silently restyles the product or
    // collides with another plugin. Hashing every module class with the manifest name
    // makes that impossible by construction. A plain .css file is not scoped for you and
    // nothing checks it: prefix every selector there by hand.
    modules: {
      generateScopedName: `${name}__[local]__[hash:hex:6]`,
    },
  },
  build: {
    lib: {
      entry: `${__dirname}src/index.ts`,
      formats: ["es"],
      fileName: () => "plugin.js",
    },
    rollupOptions: {
      // Kept out of the bundle: DocSpace supplies its own copies at load time and
      // rewrites these specifiers to them. A second React arrives with its own
      // contexts, so every SDK hook throws; a second ui-kit fails more quietly,
      // reading an empty theme context and rendering light and left-to-right
      // whatever the portal is set to.
      //
      // The SDK root is bundled like any other dependency: string enums and types,
      // no module state. Only its React entry, which owns the runtime context, has
      // to be shared. Anything else the plugin imports (a date library, a parser)
      // is bundled too - the portal provides exactly this list and refuses a
      // bundle that imports anything else.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@onlyoffice/docspace-plugin-sdk/react",
        /^@docspace\/ui-kit(\/.*)?$/,
      ],
      output: {
        // One file. The packer zips plugin.js alone and the portal imports it from a blob
        // URL, where a relative import() has nothing to resolve against - so a code-split
        // chunk is unreachable however it got there. Libraries that lazy-load their own
        // parts (diagram renderers, per-format parsers) would otherwise leave dozens of
        // chunk files in dist/ that never reach the archive.
        inlineDynamicImports: true,
        assetFileNames: (assetInfo: { name?: string }) =>
          assetInfo.name?.endsWith(".css") ? "plugin.css" : (assetInfo.name ?? "asset"),
      },
    },
  },
});
