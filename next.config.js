const packageJson = require('./package.json');

const fallbackBuildId = `${packageJson.version}-${new Date()
  .toISOString()
  .replace(/[-:.TZ]/g, '')
  .slice(0, 14)}`;

const isProductionBuild = process.env.NODE_ENV === 'production';

if (isProductionBuild && !process.env.APP_BUILD_ID?.trim()) {
  throw new Error(
    'APP_BUILD_ID is required for production builds. Set it in the deployment environment before running next build.',
  );
}

const appBuildId = (
  process.env.APP_BUILD_ID ||
  process.env.GITHUB_SHA ||
  process.env.RENDER_GIT_COMMIT ||
  fallbackBuildId
).trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_APP_BUILD_ID: appBuildId,
  },
  generateBuildId: async () => appBuildId,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 100],
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_URL ? new URL(process.env.NEXT_PUBLIC_S3_URL).hostname : 's3.ybbhub.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.ybbfoundation.com',
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
      {
        protocol: 'https',
        hostname: 'staging-api.ybbhub.com',
        port: '',
        pathname: '/api/v1/images/**',
      },
    ],
    // Allow SVG responses from trusted remote hosts like placehold.co
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Allow Firebase signInWithPopup to poll window.closed on the login page.
        // COOP: same-origin (set by some hosts/proxies) breaks the opener reference.
        source: '/login',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

