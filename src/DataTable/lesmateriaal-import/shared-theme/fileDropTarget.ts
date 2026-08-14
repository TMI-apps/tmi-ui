import { alpha, type Theme } from "@mui/material/styles";

/** Shared with table row/file-drop overlays (`databaseViewerBodyCellSx`). */
export const FILE_DROP_TARGET_BORDER_WIDTH_PX = 2;

/** Primary wash while a valid file/link is dragged over a drop target (table row default). */
export function fileDropTargetActiveBackground(
  theme: Theme,
  intensity: "default" | "lightweight" = "default",
): string {
  return intensity === "lightweight"
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.primary.main, 0.14);
}

/** Slightly stronger wash on hover while drag-over (table row). */
export function fileDropTargetHoverBackground(theme: Theme): string {
  return alpha(theme.palette.primary.main, 0.2);
}

export function fileDropTargetLightweightHoverBackground(theme: Theme): string {
  return alpha(theme.palette.primary.main, 0.14);
}

export type FileDropTargetActiveSxOptions = {
  /** Primary-tinted fill + dashed primary ring (industry-standard drop affordance). */
  active: boolean;
  intensity?: "default" | "lightweight";
  borderRadius?: number | string;
};

/**
 * Active drag-over styles for block surfaces (detail pane, attachment editor, dialogs).
 * Matches table row file-drop: dashed `primary` border + light primary background.
 */
export function getFileDropTargetActiveSx(
  theme: Theme,
  options: FileDropTargetActiveSxOptions,
): Record<string, unknown> {
  if (!options.active) return {};
  const radius = options.borderRadius ?? 0;
  return {
    backgroundColor: fileDropTargetActiveBackground(theme, options.intensity),
    outline: `${FILE_DROP_TARGET_BORDER_WIDTH_PX}px dashed ${theme.palette.primary.main}`,
    outlineOffset: -FILE_DROP_TARGET_BORDER_WIDTH_PX,
    borderRadius: radius,
    transition: "outline-color 0.15s ease, background-color 0.15s ease",
  };
}
