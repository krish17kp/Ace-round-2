import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Anything you fetch like fetch("/api/...") will be forwarded to the backend
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        // if your backend is mounted at root (e.g., /api/analyze), no rewrite needed.
        // rewrite: (path) => path, // keep as-is
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
