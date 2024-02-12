import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tradeRoutes': {
        target: 'http://localhost:5050', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tradeRoutes/, ''),
      },
    },
  },
});