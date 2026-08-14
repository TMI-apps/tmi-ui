/**
 * Dev-only table list debugging: counts, scope filters, optional session context.
 *
 * Enable (any one):
 * - Vite dev build (`import.meta.env.DEV`)
 * - Hostname `localhost` or `127.0.0.1`
 * - `localStorage.setItem("debug:tableLoad", "1")` or legacy `debug:lesmateriaalTableLoad`
 */

export const TABLE_LOAD_DEBUG_LOG_PREFIX = "[table-load]";

const LOCAL_STORAGE_KEYS = [
  "debug:tableLoad",
  "debug:lesmateriaalTableLoad",
] as const;

function readLocalStorageTableDebugOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    for (const key of LOCAL_STORAGE_KEYS) {
      if (window.localStorage.getItem(key) === "1") return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function isLocalTableHostname(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

export function isTableLoadDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const env = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env;
  if (env?.DEV) return true;
  if (isLocalTableHostname()) return true;
  return readLocalStorageTableDebugOn();
}

let tableLoadLogSeq = 0;

export function logTableLoadSummary(payload: Record<string, unknown>): void {
  if (!isTableLoadDebugEnabled()) return;
  const n = ++tableLoadLogSeq;
  console.log(`${TABLE_LOAD_DEBUG_LOG_PREFIX} #${n}`, payload);
}
