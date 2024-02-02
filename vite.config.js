import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgrPlugin from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(process.env.npm_package_version),
    // "process.env": process.env,
    VITE_ENV_WALLETCONNECTV2_PROJECTID: process.env.VITE_ENV_WALLETCONNECTV2_PROJECTID,
    "import.meta.env.VITE_ENV_BACKEND_API": JSON.stringify(process.env.VITE_ENV_BACKEND_API),
    // VITE_ENV_NETWORK: process.env.VITE_ENV_NETWORK,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
    host: true,
    https: true,
    watch: {
      usePolling: false,
      useFsEvents: false,
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
    tsconfigPaths(),
    svgrPlugin(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  build: {
    outDir: "build",
  },
  preview: {
    port: 3002,
    https: true,
    host: "localhost",
    strictPort: true,
  },
});
