import rateLimit from 'express-rate-limit';

// Deliberately tighter than any tenant-facing endpoint: this guards the one
// login path that can reach every gym's data, so we fail closed fast.
export const superadminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
    errors: [],
  },
});
