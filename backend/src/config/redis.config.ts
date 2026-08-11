/**
 * Redis Configuration (Prepared for future integration)
 *
 * This file contains Redis client configuration only.
 * Actual caching logic will be implemented in a later phase.
 */

import { env } from './env.config';

export const redisConfig = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: 3,
  retryStrategy(times: number): number | null {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
};

/**
 * When ready to use Redis, initialize like:
 *
 * import Redis from 'ioredis';
 * const redis = new Redis(redisConfig.url);
 */
