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
      hostname: 's3.ybbhub.com',
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
    {
      protocol: 'https',
      hostname: 'placehold.co',
      port: '',
      pathname: '/**',
    },
  ],
  // Allow SVG responses from trusted remote hosts like placehold.co
  dangerouslyAllowSVG: true,
  unoptimized: false,
},
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
};

module.exports = nextConfig;

