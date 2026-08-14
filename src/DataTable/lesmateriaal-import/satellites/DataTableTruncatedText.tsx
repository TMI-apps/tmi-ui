import { Box, Tooltip } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { DATA_TABLE_TOOLTIP_PROPS } from "./dataTableTooltipProps.js";

const TRUNCATION_EPS_PX = 1;

/** Measures whether a single-line element's text is clipped horizontally. */
export function useIsTextTruncated<T extends HTMLElement>(
  ref: RefObject<T | null>,
  measureKey: string,
): boolean {
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setTruncated(el.scrollWidth > el.clientWidth + TRUNCATION_EPS_PX);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureKey]);

  return truncated;
}

export interface DataTableTruncatedTextProps {
  text: string;
  variant?: TypographyProps["variant"];
  component?: TypographyProps["component"];
  sx?: SxProps<Theme>;
}

/**
 * Single-line cell text with ellipsis; shows full `text` in a data-table tooltip only when truncated.
 */
export function DataTableTruncatedText({
  text,
  variant = "body2",
  component,
  sx,
}: DataTableTruncatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const truncated = useIsTextTruncated(ref, text);
  const showTooltip = truncated && text.length > 0;

  return (
    <Tooltip
      title={text}
      disableHoverListener={!showTooltip}
      {...DATA_TABLE_TOOLTIP_PROPS}
    >
      <Box
        ref={ref}
        component={component ?? "span"}
        sx={[
          {
            display: "block",
            minWidth: 0,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            typography: variant,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {text}
      </Box>
    </Tooltip>
  );
}

export interface DataTableTruncatedOverflowProps {
  /** Tooltip title when truncated; if empty, no tooltip wrapper is rendered. */
  title: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Truncates arbitrary header/cell children with ellipsis; tooltip uses shared data-table props.
 */
export function DataTableTruncatedOverflow({
  title,
  children,
  sx,
}: DataTableTruncatedOverflowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const truncated = useIsTextTruncated(ref, title);
  const showTooltip = Boolean(title) && truncated;

  const inner = (
    <Box
      ref={ref}
      sx={[
        {
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );

  if (!title) {
    return inner;
  }

  return (
    <Tooltip
      title={title}
      disableHoverListener={!showTooltip}
      {...DATA_TABLE_TOOLTIP_PROPS}
    >
      {inner}
    </Tooltip>
  );
}
