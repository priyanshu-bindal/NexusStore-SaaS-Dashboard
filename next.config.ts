import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Allow UploadThing images
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allow Unsplash images
      },
    ],
  },
};

export default nextConfig;
