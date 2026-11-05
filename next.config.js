/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // статический экспорт
    reactStrictMode: true,
    allowedDevOrigins: ['172.20.10.*'],
    turbopack: {
        root: __dirname,
    },
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
