import { env } from '../config/env.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const LOG_COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m',   // Cyan
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  debug: '\x1b[35m',  // Magenta
};

const RESET = '\x1b[0m';

const formatMessage = (level: LogLevel, message: string, ...args: unknown[]): string => {
  const timestamp = new Date().toISOString();
  const color = LOG_COLORS[level];
  const prefix = `${color}[${level.toUpperCase()}]${RESET} ${timestamp} -`;

  if (args.length > 0) {
    return `${prefix} ${message} ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}`;
  }

  return `${prefix} ${message}`;
};

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.log(formatMessage('info', message, ...args));
  },

  warn(message: string, ...args: unknown[]): void {
    console.warn(formatMessage('warn', message, ...args));
  },

  error(message: string, ...args: unknown[]): void {
    console.error(formatMessage('error', message, ...args));
  },

  debug(message: string, ...args: unknown[]): void {
    if (env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, ...args));
    }
  },
};
