import * as Sentry from "@sentry/nextjs";

const CF_PAGES_COMMIT_SHA = process.env.CF_PAGES_COMMIT_SHA.substr(0,7).toUpperCase()
const CF_PAGES_BRANCH = process.env.CF_PAGES_BRANCH
const SENTRY_DSN = "https://6c2a0bedac06463b8fea519e8603f873@logs.syvita.org/3"

if (CF_PAGES_BRANCH == 'main') { // is a prod build
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    release: CF_PAGES_COMMIT_SHA,
    sendDefaultPii: false,
    environment: "prod",
  })
} else { // is a dev build
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    release: CF_PAGES_COMMIT_SHA,
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