/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don’t fail the production build because of ESLint errors/warnings.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
