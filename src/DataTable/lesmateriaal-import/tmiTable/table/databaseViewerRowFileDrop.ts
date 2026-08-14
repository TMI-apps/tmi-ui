export interface DatabaseViewerRowFileDrop<TData extends object> {
  /** Called when files are dropped on a row. When set, rows accept file drops. */
  onDrop: (row: TData, files: File[]) => void | Promise<void>;
  /** Optional filter to allow drop only on certain rows. Default: all rows. */
  canDrop?: (row: TData) => boolean;
}
