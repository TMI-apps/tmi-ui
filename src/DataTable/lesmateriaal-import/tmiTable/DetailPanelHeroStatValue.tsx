import { Box, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useLayoutEffect, useRef, useState } from "react";

export type DetailPanelHeroStatValueProps = {
  /** Full string shown in the tooltip when the value is truncated. */
  value: string;
  /**
   * Text to render in the strip (e.g. with a “…” suffix while saving).
   * Tooltip text always comes from `value`.
   */
  displayValue?: string;
  error?: boolean;
  sx?: SxProps<Theme>;
};

/** `-webkit-line-clamp`: compare heights with rounding so sub-pixel overflow still counts as truncated. */
function isLineClampTruncated(el: HTMLElement): boolean {
  return Math.ceil(el.scrollHeight) > Math.floor(el.clientHeight);
}

/**
 * Stats strip value: clamps to theme `statsStrip.valueMaxLines`, ellipsis, tooltip with full text
 * when clipped.
 */
export function DetailPanelHeroStatValue({
  value,
  displayValue,
  error,
  sx,
}: DetailPanelHeroStatValueProps) {
  const theme = useTheme();
  const s = theme.detailPanelHero.statsStrip;
  const ref = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);
  const shown = displayValue ?? value;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setTruncated(isLineClampTruncated(el));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [shown, s.valueMaxLines]);

  const typography = (
    <Typography
      ref={ref}
      variant="body2"
      component="div"
      sx={[
        {
          color: error ? theme.palette.error.main : s.valueColor,
          fontWeight: s.statFontWeight,
          mt: 0.25,
          fontFamily: theme.typography.fontFamily,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: s.valueMaxLines,
          overflow: "hidden",
          wordBreak: "break-word",
          whiteSpace: "normal",
          overflowWrap: "break-word",
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
    >
      {shown}
    </Typography>
  );

  const tipRaw = value.trim();
  const showTip = truncated && tipRaw.length > 0 && tipRaw !== "—";

  return (
    <Tooltip
      title={value}
      enterDelay={400}
      enterNextDelay={400}
      describeChild
      disableHoverListener={!showTip}
      disableFocusListener={!showTip}
    >
      <Box
        component="span"
        sx={{ display: "block", width: "100%", minWidth: 0 }}
      >
        {typography}
      </Box>
    </Tooltip>
  );
}
