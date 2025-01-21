// next.config.js
module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  async rewrites() {
    return [
      
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  experimental: {
    middleware: true,
  },
};