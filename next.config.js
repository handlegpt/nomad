const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker deployment optimization
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['localhost'],
  },
};

module.exports = withNextIntl(nextConfig); 