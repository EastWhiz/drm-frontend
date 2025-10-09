import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈  skip ESLint on `next build`
  },
  typescript: { ignoreBuildErrors: true },
  images: {
    minimumCacheTTL: 60,
    // either "domains" …
    domains: ["surgery-abroad.com", "www.surgery-abroad.com"],
    // …or remotePatterns (both is fine)
    remotePatterns: [
      { protocol: "https", hostname: "surgery-abroad.com", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "www.surgery-abroad.com", pathname: "/wp-content/**" },
      // add http only if you truly need it; prefer https
      { protocol: "http", hostname: "surgery-abroad.com", pathname: "/wp-content/**" },
    ],
  },
};

export default nextConfig;
