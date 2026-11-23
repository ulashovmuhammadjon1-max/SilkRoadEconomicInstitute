import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every public page is pre-rendered at build time from the files in /content.
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    // The content editor lives in public/admin/index.html.
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
  async headers() {
    return [{ source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
