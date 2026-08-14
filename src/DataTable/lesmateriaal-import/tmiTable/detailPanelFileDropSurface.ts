import type { DragEvent } from "react";
import type { Theme } from "@mui/material/styles";

/** Optional full-pane drag target for file/link attach in detail edit mode. */
export interface DetailPanelFileDropSurface {
  dropHandlers: {
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
    onDropCapture: (e: DragEvent<HTMLDivElement>) => void;
    onDragOverCapture: (e: DragEvent<HTMLDivElement>) => void;
  };
  dropSurfaceSx: (theme: Theme) => Record<string, unknown>;
}
