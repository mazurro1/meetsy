const withPWA = require("next-pwa");

module.exports = withPWA({
  experimental: {
    styledComponents: true,
  },
  compiler: {
    styledComponents: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    register: true,
    sw: "/sw.js",
    cacheOnFrontEndNav: true,
  },
  images: {
    domains: [
      "meetsy-prod.s3.eu-central-1.amazonaws.com",
      "platform-lookaside.fbsbx.com",
    ],
  },
  webpack5: true,
});
