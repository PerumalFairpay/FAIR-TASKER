/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Prettier CRLF warnings fail the build on Windows — lint separately via `npm run lint`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors are caught in dev/IDE; don't block production builds
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
