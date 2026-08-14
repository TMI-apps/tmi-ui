import { Box, ButtonBase, Tooltip, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { DATA_TABLE_TOOLTIP_PROPS } from "./dataTableTooltipProps.js";

export interface TableRowActionButtonProps {
  /** Tooltip text shown on hover */
  title: string;
  /** Click handler; call event.stopPropagation() if needed. Optional when rendering as a link via `href`. */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  /** Accessibility label; defaults to title */
  "aria-label"?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button content (icon, text, etc.) */
  children: ReactNode;
  /** Tooltip placement */
  placement?: "top" | "bottom" | "left" | "right";
  /** Additional sx for the ButtonBase */
  sx?: SxProps<Theme>;
  /**
   * Force-hide the tooltip regardless of hover state (e.g. while a menu
   * triggered by this button is open). Leave undefined to use default
   * hover-driven behavior.
   */
  tooltipOpen?: false;
  /**
   * Render as an `<a>` link. When set, the underlying `ButtonBase` uses
   * `component="a"` with `href`/`target`/`rel`, preserving middle-click and
   * other native anchor affordances. `onClick` still runs (useful for
   * stopping row-click propagation).
   */
  href?: string;
  target?: string;
  rel?: string;
}

export function TableRowActionButton({
  title,
  onClick,
  "aria-label": ariaLabel,
  disabled = false,
  children,
  placement = "right",
  sx,
  tooltipOpen,
  href,
  target,
  rel,
}: TableRowActionButtonProps) {
  const controlledOpenProps = tooltipOpen === false ? { open: false } : {};
  const anchorProps = href
    ? { component: "a" as const, href, target, rel }
    : {};
  return (
    <Tooltip
      title={title}
      placement={placement}
      {...DATA_TABLE_TOOLTIP_PROPS}
      {...controlledOpenProps}
    >
      {/* Span wrapper so Tooltip still receives hover when the button is disabled (MUI limitation). */}
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "stretch",
          height: "100%",
          alignSelf: "stretch",
          lineHeight: 0,
        }}
      >
        <ButtonBase
          {...anchorProps}
          disabled={disabled}
          onClick={onClick}
          aria-label={ariaLabel ?? title}
          sx={[
            (theme) => ({
              width: "fit-content",
              height: "100%",
              minHeight: "100%",
              alignSelf: "stretch",
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              color: "text.primary",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.body2.fontSize,
              transition: theme.transitions.create(
                ["background-color", "box-shadow"],
                {
                  duration: theme.transitions.duration.short,
                },
              ),
              "&:hover": {
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity * 1.5,
                ),
              },
              "&:active": {
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity,
                ),
              },
              "&.Mui-focusVisible": {
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity,
                ),
                boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
              },
              "&.Mui-disabled": {
                opacity: theme.palette.action.disabledOpacity,
              },
            }),
            ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
          ]}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              lineHeight: 0,
            }}
          >
            {children}
          </Box>
        </ButtonBase>
      </Box>
    </Tooltip>
  );
}
