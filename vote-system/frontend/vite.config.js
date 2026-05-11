import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Minify CSS and JavaScript
    minify: 'esbuild',
    // Terser is too slow; esbuild is faster and nearly as effective
    // esbuild: { minify: true, keepNames: false },
    
    // Rollup optimization
    rollupOptions: {
      output: {
        // Code-split for better caching
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
        // Optimize CSS and JS
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name].[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          }
          return `[name].[hash][extname]`;
        },
      },
    },

    // Compression settings
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production (saves ~30% size)
    reportCompressedSize: true,

    // Target modern browsers to reduce polyfills
    target: 'esnext',
  },
});