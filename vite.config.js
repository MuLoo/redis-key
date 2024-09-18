import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://s.yupoo.com/redis-key/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      }
    }
  }
})

