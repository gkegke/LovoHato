import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()],
    assetsInclude: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|jpeg|gif|webm|mp4|mov|wmv|flv|mkv|ogg)$/
  }
})
