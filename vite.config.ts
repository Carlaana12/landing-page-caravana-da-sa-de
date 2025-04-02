import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-hot-toast', 'lucide-react'],
          database: ['@supabase/supabase-js'],
          map: ['leaflet', 'react-leaflet'],
          editor: [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-image',
            '@tiptap/extension-link'
          ]
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://tmhkepakeovbzspxllkx.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 3000
  }
});