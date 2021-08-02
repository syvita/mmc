export function log(sentry, msg) {
    sentry.addBreadcrumb({
        message: msg,
        category: "log",
    })
}

export function err(sentry, error) {
    sentry.captureException(error)
}