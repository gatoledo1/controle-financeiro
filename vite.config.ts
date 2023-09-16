import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Controle Financeiro",
        short_name: "FinanControl",
        start_url: "index.html",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#008aff",
        orientation: "portrait-primary",
        icons: [
          {
              "src": "src/assets/icon/icon-money@1x.png",
              "type": "image/png",
              "sizes": "42x42",
          },
          {
              "src": "src/assets/icon/icon-money@2x.png",
              "type": "image/png",
              "sizes": "84x84",
          },
          {
              "src": "src/assets/icon/icon-money@3x.png",
              "type": "image/png",
              "sizes": "126x126",
          },
          {
              "src": "src/assets/icon/icon-money@4x.png",
              "type": "image/png",
              "sizes": "168x168",
          },
          {
              "src": "src/assets/icon/icon-money@5x.png",
              "type": "image/png",
              "sizes": "336x336",
          },
          {
              "src": "src/assets/icon/icon-money@6x.png",
              "type": "image/png",
              "sizes": "504x504",
          },
          {
              "src": "src/assets/icon/icon-money@7x.png",
              "type": "image/png",
              "sizes": "512x512",
          }
        ]
      }
    })
  ],
})
