// Logging behavior:
// - Enabled by default in non-production environments
// - Can be explicitly controlled via VITE_ENABLE_LOGS (overrides default)
//   Examples:
//     .env.development  → VITE_ENABLE_LOGS=true | false
//     .env.production   → VITE_ENABLE_LOGS=true | false

const explicitFlag = import.meta.env.VITE_ENABLE_LOGS;
const isProduction = import.meta.env.MODE === 'production';
// Default: log in development; in production only if explicitly enabled
const shouldLog = explicitFlag !== undefined
  ? explicitFlag === 'true'
  : !isProduction;

export const log = (...args: unknown[]) => { if (shouldLog) console.log(...args); };
export const info = (...args: unknown[]) => { if (shouldLog) console.info(...args); };
export const warn = (...args: unknown[]) => { if (shouldLog) console.warn(...args); };

// Keep errors visible everywhere; avoid logging PII at call sites.
export const error = (...args: unknown[]) => { console.error(...args); };
