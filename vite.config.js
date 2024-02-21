import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), // 原本的就有
  ],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
      '@': '/src' // 修改别名路径为绝对路径
    }
  },
  // AI++
  build: {
    base: '/Projects/', // 添加基本路径
    assetsDir: 'assets', // 修改资源文件输出目录

  }
})
