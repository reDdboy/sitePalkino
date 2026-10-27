/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // статический экспорт
    reactStrictMode: true,
    allowedDevOrigins: ['172.20.10.*'],
    images: {
        domains: [],
        unoptimized: true,
    },
}

module.exports = nextConfig
