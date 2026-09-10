/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/map',
        destination: 'http://45.133.9.100:8100',
      },
      {
        source: '/map/:path*',
        destination: 'http://45.133.9.100:8100/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
