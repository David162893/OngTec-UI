import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Definimos el alias '@' para que apunte a la carpeta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Esto permite que Sass entienda los alias de Vite
        api: 'modern-compiler', // Recomendado para versiones modernas de Sass
        includePaths: [path.resolve(__dirname, './src')],
      },
    },
  },
  server: {
    allowedHosts: [
      '6c41-85-51-84-4.ngrok-free.app'
    ]
  }
});