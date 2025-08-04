const { withSentryConfig } = require('@sentry/nextjs');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const webpack = require('webpack');

// Original typescript configuration
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during production builds,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Ignore /imports folder and its children during the build process
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/imports\//,
          contextRegExp: /./,
        })
      );
    }
    if (dev) {
      // Apply error overlay plugin only in development mode
      config.plugins.push(new ErrorOverlayPlugin());
      config.cache = {
        type: 'filesystem', // Enable filesystem caching in development
      };
      // Further optimizations can be added here
    }
    return config;
  },
};

// Configuration with Sentry integration and additional options
module.exports = withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  org: 'silverbow-tech',
  project: 'javascript-nextjs',
  widenClientFileUpload: true, // Upload a larger set of source maps for prettier stack traces
  transpileClientSDK: true, // Transpile SDK to be compatible with IE11
  tunnelRoute: '/monitoring', // Routes browser requests to Sentry through a Next.js rewrite
  hideSourceMaps: true, // Hides source maps from generated client bundles
  disableLogger: true, // Automatically tree-shake Sentry logger statements to reduce bundle size
  automaticVercelMonitors: true, // Enables automatic instrumentation of Vercel Cron Monitors
});
