import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Mono Motion',
        short_name: 'MonoMotion',
        description: 'Thirty-two handcrafted, ultra-smooth animations in a dark monochrome shell.',
        theme_color: '#08080a',
        background_color: '#08080a',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2}'], navigateFallback: '/index.html', cleanupOutdatedCaches: true },
      devOptions: { enabled: false }
    })
  ],
  server: { host: true, port: 5173 }
});