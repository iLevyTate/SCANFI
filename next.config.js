/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // This will ignore the problematic module in both dev and build
    config.externals = [...(config.externals || []), '@mapbox/node-pre-gyp'];
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        // ...other fallbacks if needed
      };
    }
    return config;
  },
};

module.exports = nextConfig;