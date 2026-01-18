/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: process.env.NEXT_PUBLIC_S3_URL ? new URL(process.env.NEXT_PUBLIC_S3_URL).hostname : 's3.ybbhub.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'img.youtube.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'upload.wikimedia.org',
      port: '',
      pathname: '/**',
    },
  ],
  unoptimized: false,
},
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
};

module.exports = nextConfig;

