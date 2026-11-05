import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Панель живёт по адресу /admin/ — его же отдаёт API-сервер после `npm run build`.
// В режиме разработки (npm run admin:dev → http://localhost:5173/admin/) запросы к API
// проксируются на сервер, поэтому cookie входа остаются «своими» и CORS не нужен.
const API_TARGET = process.env.API_URL || 'http://localhost:3001';

export default defineConfig({
    base: '/admin/',
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': API_TARGET,
            '/uploads': API_TARGET
        }
    }
});
