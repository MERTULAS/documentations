import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Plugin names are strings so Turbopack can load them. GFM adds tables.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
