/** `false` opts out of fill-remaining-height (nested / dialog / compact tables). */
export type TMITableMaxHeightProp = number | string | false;

/**
 * Explicit `maxHeight` wins. `false` → content-sized (no fill). Omitted → layout hook value
 * (workspace slot, or standalone breakpoint / `100%` fill — never a raw `100vh` guess).
 */
export function resolveTMITableMaxHeight(
  maxHeight: TMITableMaxHeightProp | undefined,
  layoutMaxHeight: number | string,
): number | string | undefined {
  if (maxHeight === false) {
    return undefined;
  }
  if (maxHeight !== undefined) {
    return maxHeight;
  }
  return layoutMaxHeight;
}

export function tmiTableHeightMode(
  resolvedMaxHeight: number | string | undefined,
): "fill" | "pin" | "content" {
  if (resolvedMaxHeight === undefined) {
    return "content";
  }
  if (resolvedMaxHeight === "100%") {
    return "fill";
  }
  return "pin";
}
