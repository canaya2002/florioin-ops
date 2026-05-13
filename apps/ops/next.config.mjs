/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@florioin-ops/ops-ui', '@florioin-ops/ops-core', '@florioin-ops/ops-db'],
};

export default nextConfig;
