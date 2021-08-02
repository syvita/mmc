const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    path: "",
  },
};

const SentryWebpackPluginOptions = {
  silent: false, // Suppresses all logs
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);