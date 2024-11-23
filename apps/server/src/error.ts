import * as Sentry from '@sentry/nextjs';

const { NODE_ENV, SENTRY_DSN } = process.env;

export function handleError(error: Error) {
  if (NODE_ENV !== 'production') return;

  if (!Sentry.isInitialized()) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      enableTracing: true,
    });
  }

  Sentry.captureException(error);
}
