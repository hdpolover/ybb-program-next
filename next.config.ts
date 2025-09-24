import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
  },
  eslint: {
    // Ignore ESLint errors during builds for development
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds for development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
