/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Disable WebAssembly for server builds to avoid SSR issues
    if (config.name === 'server') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        crypto: false,
      };

      // Ignore WebAssembly modules in server build
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'javascript/auto',
      });
    } else {
      // Enable WebAssembly for client builds
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
