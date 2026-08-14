import type { TooltipProps } from "@mui/material/Tooltip";

/**
 * Shared hover tooltips for dense data tables: the popover must not capture the pointer,
 * so users can move the cursor to the next row/cell without the tooltip staying open and blocking clicks.
 *
 * @see https://mui.com/material-ui/react-tooltip/#non-interactive-tooltips
 */
export const DATA_TABLE_TOOLTIP_PROPS: Pick<
  TooltipProps,
  "disableInteractive" | "enterDelay" | "enterNextDelay" | "slotProps"
> = {
  disableInteractive: true,
  enterDelay: 600,
  enterNextDelay: 600,
  slotProps: {
    tooltip: {
      sx: { pointerEvents: "none" },
    },
    popper: {
      sx: { pointerEvents: "none" },
    },
  },
};
