/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Giảm EMFILE "too many open files" trên macOS: dùng polling thay vì native watch
  webpack: (config, { dev }) => {
    if (dev && process.env.WATCHPACK_POLLING === '1') {
      config.watchOptions = { ...config.watchOptions, poll: 1000, aggregateTimeout: 300 };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/**' },
      { protocol: 'https', hostname: '**', pathname: '/**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
};

module.exports = nextConfig;
