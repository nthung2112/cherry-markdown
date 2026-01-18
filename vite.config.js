import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: `assets/c-[name]-chunk.js`,
      },
    },
  },
});
