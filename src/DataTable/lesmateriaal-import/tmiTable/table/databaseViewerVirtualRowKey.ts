/** TanStack Virtual item key from a TanStack row id. */
export function buildDatabaseViewerVirtualRowKey(
  rowId: string | undefined | null,
): string {
  if (rowId === undefined || rowId === null || rowId === "") {
    return "noid";
  }
  return String(rowId);
}

/** Dev-only: warn when flattened row ids would collide under id-only virtual keys. */
export function warnDuplicateDatabaseViewerVirtualRowKeys(
  rowIds: readonly string[],
  context = "DatabaseViewer",
): void {
  const env = (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env;
  if (env?.PROD) return;
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const rowId of rowIds) {
    const key = buildDatabaseViewerVirtualRowKey(rowId);
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  }
  if (duplicates.size > 0) {
    console.warn(`[${context}] duplicate virtual row keys detected:`, [
      ...duplicates,
    ]);
  }
}
