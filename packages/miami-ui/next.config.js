const { withSentryConfig } = require("@sentry/nextjs");
const SENTRY_DSN = "https://6c2a0bedac06463b8fea519e8603f873@logs.syvita.org/3"

if (process.env.CF_PAGES_COMMIT_SHA == undefined && process.env.CF_PAGES_BRANCH == undefined) {
  var SentryWebpackPluginOptions = {
    silent: true,
  }
} else {
  const CF_PAGES_COMMIT_SHA = process.env.CF_PAGES_COMMIT_SHA.substr(0,7).toUpperCase()
  const CF_PAGES_BRANCH = process.env.CF_PAGES_BRANCH
  
  if (CF_PAGES_BRANCH == 'main') { // is a prod build
    var SentryWebpackPluginOptions = {
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      release: CF_PAGES_COMMIT_SHA,
      sendDefaultPii: false,
      environment: "prod",
    }
  } else if (CF_PAGES_BRANCH == undefined && CF_PAGES_COMMIT_SHA == undefined) {
    var SentryWebpackPluginOptions = {
      silent: true
    }
  } else { // is a dev build
    var SentryWebpackPluginOptions = {
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      release: CF_PAGES_COMMIT_SHA,
      sendDefaultPii: false,
      environment: "dev",
      debug: true,
    }
  }
}

const moduleExports = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    path: "",
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);