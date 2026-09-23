import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Removes X-Powered-By header
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
