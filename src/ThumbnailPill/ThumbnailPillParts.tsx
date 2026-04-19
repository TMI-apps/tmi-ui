import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

const PILL_HEIGHT_SPACING_UNITS = 4;
const DEFAULT_PILL_BORDER_RADIUS_INDEX = 2;

interface ThumbPlaceholderProps {
  thumbnailSize: number;
  iconSize: number;
  isAppBar: boolean;
  thumbnailPlaceholder?: ReactNode;
}

export function ThumbnailPillThumbPlaceholder({
  thumbnailSize,
  iconSize,
  isAppBar,
  thumbnailPlaceholder,
}: ThumbPlaceholderProps) {
  if (!thumbnailPlaceholder) return null;
  return (
    <Box
      sx={(t: Theme) => ({
        width: thumbnailSize,
        height: thumbnailSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: isAppBar ? alpha(t.palette.primary.contrastText, 0.2) : t.palette.action.hover,
        color: isAppBar ? t.palette.primary.contrastText : t.palette.text.secondary,
        "& .MuiSvgIcon-root": { fontSize: t.typography.pxToRem(iconSize) },
      })}
    >
      {thumbnailPlaceholder}
    </Box>
  );
}

interface ThumbImageProps {
  thumbnail: string;
  thumbnailSize: number;
}

export function ThumbnailPillThumbImage({ thumbnail, thumbnailSize }: ThumbImageProps) {
  return (
    <Box
      component="img"
      src={thumbnail}
      alt=""
      sx={{
        width: thumbnailSize,
        height: thumbnailSize,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  );
}

interface TitleProps {
  title: string;
  isAppBar: boolean;
  titleFontSizeXs: number;
  maxWidthAppBar: number;
}

export function ThumbnailPillTitleText({
  title,
  isAppBar,
  titleFontSizeXs,
  maxWidthAppBar,
}: TitleProps) {
  return (
    <Typography
      variant="body2"
      sx={(t: Theme) => ({
        fontSize: isAppBar
          ? { xs: t.typography.pxToRem(titleFontSizeXs), sm: t.typography.body2.fontSize }
          : t.typography.body2.fontSize,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0,
        maxWidth: isAppBar ? t.spacing(maxWidthAppBar) : "100%",
      })}
    >
      {title}
    </Typography>
  );
}

interface MainRowProps {
  to?: string;
  onClick?: () => void;
  isAppBar: boolean;
  children: ReactNode;
}

export function ThumbnailPillMainRow({ to, onClick, isAppBar, children }: MainRowProps) {
  const rowSx = (t: Theme) => ({
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    gap: 1,
    color: isAppBar ? t.palette.primary.contrastText : t.palette.text.primary,
    textDecoration: "none",
    "&:hover": {
      color: isAppBar ? t.palette.primary.contrastText : t.palette.text.primary,
    },
  });

  if (to) {
    return (
      <Box component={Link} to={to} sx={rowSx}>
        {children}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        gap: 1,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </Box>
  );
}

export interface BuildPillContainerSxParams {
  theme: Theme;
  isAppBar: boolean;
  isClickable: boolean;
  disabled: boolean;
  pillBorderRadius: number;
  pillMaxWidthAppBar: number;
  maxWidth: number | string | undefined;
  /** A thumbnail or placeholder circle is rendered at the start of the pill. */
  hasLeftCircle: boolean;
  /** A thumbnail or placeholder circle is rendered at the end of the pill. */
  hasRightCircle: boolean;
  /** A right slot (icon / button) is rendered at the end of the pill. */
  hasRightSlot: boolean;
}

/**
 * Side padding in spacing units.
 * - With a circle on that side: 2 px, matching (height 32 − circle 28) / 2
 *   so the circle is equidistant from the pill's top, bottom, and outer edge.
 * - With a rightSlot: 4 px, the default — the slot's own chrome handles spacing.
 * - Bare text (no circle, no rightSlot): 12 px, matching MUI Chip's side padding
 *   so text doesn't butt against the pill edge.
 */
const PADDING_WITH_CIRCLE = 0.25;
const PADDING_WITH_SLOT = 0.5;
const PADDING_BARE_TEXT = 1.5;

export function buildPillContainerSx(p: BuildPillContainerSxParams): Record<string, unknown> {
  const {
    theme,
    isAppBar,
    isClickable,
    disabled,
    pillBorderRadius,
    pillMaxWidthAppBar,
    maxWidth,
    hasLeftCircle,
    hasRightCircle,
    hasRightSlot,
  } = p;
  const primarySurface =
    theme.palette.primary.surface ?? alpha(theme.palette.primary.main, 0.08);
  const primarySurfaceHover =
    theme.palette.primary.surfaceHover ?? alpha(theme.palette.primary.main, 0.12);
  const pl = hasLeftCircle ? PADDING_WITH_CIRCLE : PADDING_BARE_TEXT;
  const pr = hasRightCircle
    ? PADDING_WITH_CIRCLE
    : hasRightSlot
      ? PADDING_WITH_SLOT
      : PADDING_BARE_TEXT;
  return {
    display: "flex",
    alignItems: "center",
    height: theme.spacing(PILL_HEIGHT_SPACING_UNITS),
    pl,
    pr,
    borderRadius: theme.spacing(pillBorderRadius ?? DEFAULT_PILL_BORDER_RADIUS_INDEX),
    backgroundColor: isAppBar
      ? alpha(theme.palette.primary.contrastText, 0.15)
      : primarySurface,
    cursor: isClickable ? "pointer" : "default",
    minWidth: 0,
    maxWidth: maxWidth ?? (isAppBar ? theme.spacing(pillMaxWidthAppBar) : "none"),
    gap: 1.5,
    opacity: disabled ? 0.6 : 1,
    "&:hover": isClickable && !isAppBar ? { backgroundColor: primarySurfaceHover } : {},
  };
}

interface TooltipWrapProps {
  tooltip?: string | ReactNode;
  children: ReactNode;
}

export function ThumbnailPillTooltipWrap({ tooltip, children }: TooltipWrapProps) {
  if (tooltip === undefined || tooltip === null || tooltip === "") {
    return <>{children}</>;
  }
  // Non-interactive tooltip (like dense table row actions): pointer must not stick on the popper.
  return (
    <Tooltip
      title={
        typeof tooltip === "string" ? (
          <Box
            component="span"
            sx={{ whiteSpace: "pre-line", display: "block", textAlign: "left" }}
          >
            {tooltip}
          </Box>
        ) : (
          tooltip
        )
      }
      disableInteractive
      enterDelay={600}
      enterNextDelay={600}
      slotProps={{
        tooltip: {
          sx: { pointerEvents: "none" },
        },
        popper: {
          sx: { pointerEvents: "none" },
        },
      }}
    >
      <span style={{ display: "inline-flex", maxWidth: "100%" }}>{children}</span>
    </Tooltip>
  );
}
