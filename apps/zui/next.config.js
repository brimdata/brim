/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  experimental: {
    appDir: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@brimdata/zed-js"],
}

module.exports = nextConfig
