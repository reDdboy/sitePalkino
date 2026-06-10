/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true, // Включаем статический экспорт
    images: {
        domains: [],
        unoptimized: true, // Отключаем оптимизацию изображений Next.js
    },

}

module.exports = nextConfig
