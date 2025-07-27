const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker部署优化
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    appDir: true,
  },
  
  // 图片优化
  images: {
    domains: ['localhost'],
  },
};

module.exports = withNextIntl(nextConfig); 