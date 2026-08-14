import type { ChangeEvent, DragEvent, RefObject } from "react";
import type { Theme } from "@mui/material/styles";

export type DetailHeroCoverMeta = { src: string; fallbackSrc: string | null };

export type DetailPanelHeroCoverEdit = {
  editable: boolean;
  lockedReason?: string;
  dragActive?: boolean;
  dropSurfaceSx?: (theme: Theme) => Record<string, unknown>;
  uploading?: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onCoverClick: () => void;
  onFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
};
