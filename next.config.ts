import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["shorten-fade-stuck.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
