// Safe env access that works in browser builds and avoids "process is not defined"
const read = (k: string): string | undefined => {
  // Vite / Astro
  // @ts-ignore
  const viteVal = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[k]) as string | undefined;
  if (viteVal) return viteVal;

  // Next.js (guarded)
  // @ts-ignore
  const procVal = (typeof process !== "undefined" && process.env && process.env[k]) as string | undefined;
  if (procVal) return procVal;

  // Optional window-injected env
  // @ts-ignore
  const winVal = (typeof window !== "undefined" && (window as any).__ENV__ && (window as any).__ENV__[k]) as string | undefined;
  return winVal;
};

// TODO: Replace with Node.js backend configuration when ready
const FALLBACK_URL = 'http://localhost:3001/api';
const FALLBACK_KEY = 'nodejs-backend-key';

export const BACKEND_URL =
  read("VITE_BACKEND_URL") || read("NEXT_PUBLIC_BACKEND_URL") || FALLBACK_URL;

export const BACKEND_API_KEY =
  read("VITE_BACKEND_API_KEY") || read("NEXT_PUBLIC_BACKEND_API_KEY") || FALLBACK_KEY;