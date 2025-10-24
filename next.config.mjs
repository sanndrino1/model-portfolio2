/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Оптимизация на изображения
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Компресия
  compress: true,
  // Strict Mode за по-добра производителност
  reactStrictMode: true,
  // Оптимизация на бъндъла
  swcMinify: true,
}

export default nextConfig