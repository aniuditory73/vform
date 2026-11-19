import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  basePath: "/vform",
  images: { unoptimized: true },
  devIndicators: false,
  agentRules: false,
};

export default config;
