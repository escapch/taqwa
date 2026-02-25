const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/app-build-manifest\.json$/, /middleware-manifest\.json$/],
  // next-pwa auto-merges worker/index.js into the generated service worker
});

module.exports = withPWA({
  // Твои другие настройки Next.js
});

