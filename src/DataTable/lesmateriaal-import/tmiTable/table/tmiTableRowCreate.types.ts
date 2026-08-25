/** How a last-row create was submitted. */
export type TmiTableRowCreateSource = "commit" | "paste";

/** Payload passed to {@link TmiTableRowCreateConfig.onCreate}. */
export interface TmiTableRowCreateRequest {
  columnId: string;
  value: string;
  source: TmiTableRowCreateSource;
}

/**
 * Opt-in last-row create. Omit on {@link DatabaseViewerProps} / {@link TmiTableProps}
 * to keep current behavior.
 *
 * The pin is viewport chrome (not a TanStack data row). Tree parent and pending
 * row styling are consumer-owned (`rowSavePending` + optional
 * {@link OptimisticTableFeedbackProvider}).
 */
export interface TmiTableRowCreateConfig {
  /**
   * Called once per typed commit or per non-blank pasted line.
   * Return the new row id. Empty string or a rejected promise is a failed create.
   */
  onCreate: (request: TmiTableRowCreateRequest) => string | Promise<string>;
  /** Accessible name for the pinned create strip. */
  ariaLabel?: string;
}

export type TMITableRowCreateSource = TmiTableRowCreateSource;
export type TMITableRowCreateRequest = TmiTableRowCreateRequest;
export type TMITableRowCreateConfig = TmiTableRowCreateConfig;
