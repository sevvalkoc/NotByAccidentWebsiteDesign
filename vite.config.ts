import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Tailwind only touches src/admin/admin.css (the CMS tool keeps its
// original utility classes). The public site uses its own CSS system.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { target: 'es2022', sourcemap: false, reportCompressedSize: true },
  ssr: { noExternal: ['@fontsource-variable/lora', '@fontsource-variable/dm-sans'] },
  server: { host: '0.0.0.0', port: Number(process.env.PORT || 5173) },
})
