import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || "https://6c2a0bedac06463b8fea519e8603f873@logs.syvita.org/3",
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  sendDefaultPii: false,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

// this acts as a safeguard to ensure everyone can prove that we are not 
// collecting user IPs. we don't want it or need it. we also have enhanced privacy
// controls to remove personally identifiable information (PII) as well as source 
// code in things like notifications. we prevent IPs being stored client-side,
// and also scrub things like passwords, MAC addresses and other similar PII from
// ever being stored on our Sentry instances.
Sentry.setUser({ ip_address: "0.0.0.0" });