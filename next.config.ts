import type { NextConfig } from "next";
const backend = process.env.API_INTERNAL_URL || "http://127.0.0.1:4000";
const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["@tubedict/shared"],
  async rewrites() { return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }]; },
};
export default config;
