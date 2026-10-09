import { type SyntheticEvent, useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import {
  alpha,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material/styles";

/** Muted backdrop + centred em dash before a row thumb loads or when there is no URL. */
export const tableRowThumbnailPlaceholderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "text.disabled",
  fontSize: 14,
  lineHeight: 1,
  bgcolor: (theme) =>
    alpha(
      theme.palette.text.primary,
      theme.palette.mode === "light"
        ? theme.palette.action.hoverOpacity * 0.85
        : theme.palette.action.hoverOpacity * 1.65,
    ),
};

export function TableRowThumbnailPlaceholder({
  layered = false,
}: {
  layered?: boolean;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        ...tableRowThumbnailPlaceholderSx,
        ...(layered
          ? { position: "absolute", inset: 0, width: "auto", height: "auto" }
          : { width: "100%", height: "100%" }),
      }}
    >
      —
    </Box>
  );
}

/**
 * Paint-dip row thumbnail (`meta.rowThumbnailCell`): themed placeholder underneath, **`Fade`** on **`onLoad`**,
 * async **`img`**. Default **`loading="lazy"`** + low fetch priority. Pass **`imgLoading="eager"`** on
 * `rowReorder` tables so a drag-hidden source row cannot stall the load.
 *
 * Caller supplies **`src` / `alt` / optional `onError`** (Lesmateriaal fallback swapping); no URL resolution here.
 */
export function TableRowThumbnailShell({
  src,
  alt,
  onError,
  imgLoading = "lazy",
}: {
  src: string;
  alt: string;
  /** Forwarded from `<img>` — e.g. Lesmateriaal fallback phase or caller-driven failure state */
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
  /**
   * Native `img` loading hint. `"eager"` for viewport row thumbs in reorder tables.
   * @default "lazy"
   */
  imgLoading?: "lazy" | "eager";
}) {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <TableRowThumbnailPlaceholder layered />
      <Fade in={loaded} timeout={theme.transitions.duration.standard}>
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={imgLoading}
          decoding="async"
          {...(imgLoading === "lazy" ? { fetchPriority: "low" as const } : {})}
          onError={onError}
          onLoad={() => setLoaded(true)}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Fade>
    </Box>
  );
}
