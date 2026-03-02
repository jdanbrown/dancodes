import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    proxy: {
      // In dev, proxy API calls to local opencode + sidecar (running in docker)
      "/event": { target: "http://localhost:8080", ws: true },
      "/session": "http://localhost:8080",
      "/provider": "http://localhost:8080",
      "/global": "http://localhost:8080",
      "/admin": "http://localhost:8080",
      "/auth": "http://localhost:8080",
      "/version.json": "http://localhost:8080",
    },
  },
});
