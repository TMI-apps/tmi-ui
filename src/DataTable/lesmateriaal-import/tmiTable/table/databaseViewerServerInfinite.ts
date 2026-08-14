export interface DatabaseViewerServerInfinite {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  nextPageError: string | null;
  onRetryNextPage: () => void;
  totalLoaded: number;
  totalCount: number;
}

export type TMITableServerInfinite = DatabaseViewerServerInfinite;
