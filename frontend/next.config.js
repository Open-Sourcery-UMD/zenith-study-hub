/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Configure images domain for external image sources
  images: {
    domains: [
      'localhost',
      'your-backend-domain.com', // Replace with your actual backend domain
      'storage.googleapis.com', // If using Google Cloud Storage
      'amazonaws.com' // If using AWS S3
    ],
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
  },
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
  
  // Environment variables to expose to the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Zenith Study Hub',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for custom optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable app directory (Next.js 13+)
    appDir: true,
    // Server components
    serverComponentsExternalPackages: ['pdf-parse', 'canvas'],
  },
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'auth-token',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
