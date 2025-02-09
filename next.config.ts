import type { NextConfig } from "next";

import withPWA from "@ducanh2912/next-pwa";

const withPWAConfig = withPWA({
  disable: process.env.NODE_ENV === "development",
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  dest: "public",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        protocol: "https",
        search: "",
      },
    ],
  },
};

export default withPWAConfig(nextConfig);
