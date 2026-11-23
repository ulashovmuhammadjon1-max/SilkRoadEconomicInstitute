import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is pre-rendered at build time from the files in /content.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
