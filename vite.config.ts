import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/src/app/main.tsx', // 엔트리 포인트를 /src/app/main.tsx로 지정
    },
  },
});
