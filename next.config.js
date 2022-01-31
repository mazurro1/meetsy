const withPWA = require("next-pwa");

module.exports = withPWA({
  experimental: {
    styledComponents: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    register: true,
    sw: "/sw.js",
    cacheOnFrontEndNav: true,
  },
});
