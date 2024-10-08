/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    MULTION_ORG_ID: process.env.MULTION_ORG_ID,
    MULTION_API_KEY: process.env.MULTION_API_KEY,
  },
};

export default nextConfig;
