/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
