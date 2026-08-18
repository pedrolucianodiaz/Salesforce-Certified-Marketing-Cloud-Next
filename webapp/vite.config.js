import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// El sitio se publica bajo /Salesforce-Certified-Marketing-Cloud-Next/
// en GitHub Pages (project site), por eso el base apunta a esa subruta.
const BASE = '/Salesforce-Certified-Marketing-Cloud-Next/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Salesforce Marketing Cloud Next — Guía',
        short_name: 'MC Next',
        description: 'Guía de estudio para la certificación Salesforce Marketing Cloud Next.',
        lang: 'es',
        theme_color: '#0176d3',
        background_color: '#032d60',
        display: 'standalone',
        orientation: 'portrait',
        scope: BASE,
        start_url: BASE,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // cachear los .md de la guía para que funcione offline
        globPatterns: ['**/*.{js,css,html,png,svg,md}'],
      },
    }),
  ],
})
