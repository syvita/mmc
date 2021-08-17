import * as Sentry from "@sentry/nextjs";

function getCommitSHA() {
  if (process.env.CF_PAGES_COMMIT_SHA == undefined) {
    return null
  } else {
    return process.env.CF_PAGES_COMMIT_SHA.substr(0,7).toUpperCase()
  }
}

const SENTRY_DSN = "https://5ea6ded89bfe4ff78ee9934ef0ddd0cf@o955003.ingest.sentry.io/5911252"

if (process.env.CF_PAGES_BRANCH == 'prod') { // minemiamicoin.com main build
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      release: getCommitSHA(),
      sendDefaultPii: false,
      environment: "prod",
    })
} else { // dev build, local or hosted
  // any events coming from local will be filtered by logs engine
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    release: getCommitSHA(),
    sendDefaultPii: false,
    environment: "dev",
    debug: true,
  })
}

// this acts as a safeguard to ensure everyone can prove that we are not 
// collecting user IPs. we don't want it or need it. we also have enhanced privacy
// controls to remove personally identifiable information (PII) as well as source 
// code in things like notifications. we prevent IPs being stored client-side,
// and also scrub things like passwords, MAC addresses and other similar PII from
// ever being stored on our Sentry instances.
Sentry.setUser({ ip_address: "0.0.0.0" });