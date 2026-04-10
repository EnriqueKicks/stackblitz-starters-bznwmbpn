import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa' // 🔥 DESACTIVADO TEMPORALMENTE

export default defineConfig({
  plugins: [
    react(),

    // 🔥 PWA DESACTIVADA PARA EVITAR ERRORES EN INSTALACIÓN
    /*
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['icon-192.png', 'icon-512.png'],

      manifest: {
        name: 'Spelling App',
        short_name: 'Spelling',
        description: 'App de práctica de spelling',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    */
  ]
})
