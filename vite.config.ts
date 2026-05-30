import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  // server: { host: true, https: false, strictPort: true, allowedHosts: true },
  plugins: [
    react(),
    basicSsl(),
    {
      name: "copy-headers",
      closeBundle() {
        try {
          fs.copyFileSync("_headers", "dist/_headers");
        } catch (e) {
          console.error("Failed to copy _headers:", e);
        }
      },
    },
  ],
  base: "/",
  build: {
    assetsDir: "",
  },
});
