/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker deployment optimization
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['localhost'],
  },

  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_OPENWEATHER_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
  },
};

module.exports = nextConfig; 