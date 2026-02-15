/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  transpilePackages: [
    '@jbrowse/react-linear-genome-view',
    '@jbrowse/core',
    '@jbrowse/plugin-linear-genome-view',
  ],
  webpack: (config, { isServer }) => {
    // Add fallback for node modules that might cause issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
