/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch hydration mismatches
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Removed deprecated experimental and swcMinify
}

export default nextConfig
