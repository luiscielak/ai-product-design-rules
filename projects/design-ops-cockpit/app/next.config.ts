import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Client mock store + useParams; Cache Components is a poor fit for this prototype. */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
