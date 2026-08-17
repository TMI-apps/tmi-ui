/** Vite dev flag — isolated for unit tests (Vitest inlines `import.meta.env.DEV`). */
export function isViteDevBuild(): boolean {
  const env = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env;
  return env?.DEV === true;
}
