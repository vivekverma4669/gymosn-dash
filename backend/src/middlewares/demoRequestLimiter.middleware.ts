import rateLimit from 'express-rate-limit';

// This is a public, unauthenticated write endpoint (landing page lead form) — rate-limit it to deter spam.
export const demoRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.',
    errors: [],
  },
});
