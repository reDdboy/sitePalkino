/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true, // Включаем статический экспорт
    images: {
        domains: [],
        unoptimized: false, // Отключаем оптимизацию изображений Next.js
    },

}

module.exports = nextConfig
