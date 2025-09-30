import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', 
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "video-vault-rp.s3.ap-south-1.amazonaws.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;