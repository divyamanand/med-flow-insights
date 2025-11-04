import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // Use Vite's default dev port to match server CORS ALLOWED_ORIGINS
    // The server allows http://localhost:5173 by default
    port: 5173,
  },
  plugins: [
    // Run tagger before React so TSX parses correctly post-injection
    (mode === 'development' && componentTagger()) as any,
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
