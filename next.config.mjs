// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next will pick the first format the browser advertises in `Accept`
    formats: ['image/avif', 'image/webp'],
    domains: ['demo.ampereonenergy.com'],
  },
};

export default nextConfig;
