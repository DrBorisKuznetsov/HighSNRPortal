import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/zrender")) {
            return "zrender";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/lucide-react")) {
            return "ui-vendor";
          }
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5175,
  },
});
