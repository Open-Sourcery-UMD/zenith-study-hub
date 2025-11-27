/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  },
  // Optimize for production
  swcMinify: true,
  // Handle trailing slashes
  trailingSlash: false,
  // Output standalone for better performance
  output: 'standalone',
}

module.exports = nextConfig