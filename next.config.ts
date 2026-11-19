import type { NextConfig } from "next";

const isPagesBuild = process.env.VFORM_GITHUB_PAGES === "true";
const basePath = isPagesBuild ? "/vform" : "";

const config: NextConfig = {
  output: isPagesBuild ? "export" : undefined,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: isPagesBuild },
  devIndicators: false,
  agentRules: false,
};

export default config;
