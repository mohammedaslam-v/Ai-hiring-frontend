// Logs are OFF by default in all environments.
// Turn them ON by setting VITE_ENABLE_LOGS=true in your .env file.
// Examples:
//   .env.development  → VITE_ENABLE_LOGS=true
//   .env.production   → VITE_ENABLE_LOGS=true

const shouldLog = import.meta.env.VITE_ENABLE_LOGS === 'true';

export const log = (...args: unknown[]) => { if (shouldLog) console.log(...args); };
export const info = (...args: unknown[]) => { if (shouldLog) console.info(...args); };
export const warn = (...args: unknown[]) => { if (shouldLog) console.warn(...args); };

// Keep errors visible everywhere; avoid logging PII at call sites.
export const error = (...args: unknown[]) => { console.error(...args); };
