import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import compress from "@playform/compress";
import compressor from "astro-compressor";
import preact from "@astrojs/preact";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://portal.vvidhya.com",

  integrations: [
    compress({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
        },
      },
      Image: true,
      JavaScript: true,
      SVG: false,
    }),
    compressor({
      fileExtensions: [".html", ".css", ".js", ".mjs", ".svg"],
      gzip: true,
      brotli: true,
    }),
    preact(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  output: "server",
  adapter: cloudflare(),

  build: {
    assets: "resources",
  },
});
