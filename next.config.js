const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "enlace-freelance.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@react-email/tailwind",
    ],
  },
};

module.exports = withContentlayer(nextConfig);
