/**
 * Clears row selection when {@link clearRowSelectionKey} changes — not on mount or callback identity churn.
 */
export function shouldClearRowSelectionForKeyChange(
  previousKey: string | number | undefined,
  nextKey: string | number | undefined,
): boolean {
  if (nextKey === undefined) return false;
  if (previousKey === undefined) return false;
  return previousKey !== nextKey;
}
