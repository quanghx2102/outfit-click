import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.shopee.sg",
      },
      {
        protocol: "https",
        hostname: "*.shopee.vn",
      },
      {
        protocol: "https",
        hostname: "**.img.shopeecdn.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};

export default nextConfig;
