import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16: only these paths may be passed to `next/image` (query strings allowed under /projects).
    localPatterns: [
      { pathname: "/projects/**" },
      { pathname: "/profile.png" },
    ],
  },
};

export default nextConfig;
