import { Box, Button, ButtonBase, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { getTableInteractionSkin } from "../DataTable/lesmateriaal-import/shared-theme/tableInteractionSkin.js";
import { resolveTmiPrimaryContained } from "./tmiPrimaryContained.js";

export interface ListRowAddButtonProps {
  /** Visible label (e.g. “Toevoegen…”). */
  label: string;
  onClick: () => void;
  /** Defaults to `label`. */
  ariaLabel?: string;
  /** Optional icon before the label (e.g. paperclip). */
  startIcon?: ReactNode;
  skinPreset?: Parameters<typeof getTableInteractionSkin>[1];
  sx?: SxProps<Theme>;
  /**
   * `subtle`: dashed row, neutral fill (default).
   * `primary`: same row dimensions as table rows; uses `theme.tmiPrimaryContained`
   * (not MUI `Button` contained overrides).
   */
  visualVariant?: "subtle" | "primary";
  disabled?: boolean;
}

function subtleRowShellSx(
  theme: Theme,
  skinPreset: Parameters<typeof getTableInteractionSkin>[1],
) {
  const skin = getTableInteractionSkin(theme, skinPreset);
  return {
    width: "100%",
    minHeight: skin.rowMinHeightPx,
    borderRadius: `${skin.rowBorderRadiusPx}px`,
    px: 1,
    py: 0.5,
    justifyContent: "flex-start" as const,
    gap: 1,
    textAlign: "left" as const,
    textTransform: "none" as const,
  };
}

/**
 * Full-width control shaped like a table/list row; use as the last row to invite “add” actions.
 */
export function ListRowAddButton({
  label,
  onClick,
  ariaLabel,
  startIcon,
  skinPreset = "lightweight",
  sx,
  visualVariant = "subtle",
  disabled = false,
}: ListRowAddButtonProps) {
  const a11y = ariaLabel ?? label;

  if (visualVariant === "primary") {
    return (
      <Button
        type="button"
        variant="contained"
        color="primary"
        fullWidth
        disabled={disabled}
        aria-label={a11y}
        onClick={onClick}
        sx={[
          (theme) => {
            const skin = getTableInteractionSkin(theme, skinPreset);
            const contained = resolveTmiPrimaryContained(theme);
            const h = skin.rowMinHeightPx;
            return {
              display: "flex",
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: 0,
              width: "100%",
              height: h,
              minHeight: h,
              maxHeight: h,
              minWidth: 0,
              m: 0,
              padding: `${theme.spacing(0)} ${theme.spacing(1)}`,
              borderRadius: `${skin.rowBorderRadiusPx}px`,
              overflow: "hidden",
              boxSizing: "border-box",
              textTransform: "none",
              fontSize: theme.typography.body2.fontSize,
              fontWeight: theme.typography.fontWeightRegular,
              lineHeight: 1,
              color: theme.palette.common.white,
              background: contained.gradient,
              backgroundSize: "200% 200%",
              backgroundPosition: "0% 50%",
              boxShadow: contained.restShadow,
              "&:hover": {
                background: contained.gradient,
                boxShadow: contained.restShadow,
              },
              "&:active": {
                boxShadow: contained.activeShadow,
              },
            };
          },
          ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ]}
      >
        <Box
          component="span"
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            px: 0.75,
            gap: 1,
            minHeight: "100%",
          }}
        >
          {startIcon ? (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 0,
                flexShrink: 0,
              }}
            >
              {startIcon}
            </Box>
          ) : null}
          <Typography
            variant="body2"
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              color: "inherit",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Button>
    );
  }

  return (
    <ButtonBase
      focusRipple
      disabled={disabled}
      aria-label={a11y}
      onClick={onClick}
      sx={[
        (theme) => {
          const skin = getTableInteractionSkin(theme, skinPreset);
          return {
            ...subtleRowShellSx(theme, skinPreset),
            display: "flex",
            alignItems: "center",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: skin.rowBackground,
            transition: "background-color 0.15s ease, border-color 0.15s ease",
            "&:hover": {
              bgcolor: skin.rowHoverBackground,
              borderColor: "primary.main",
            },
            "&.Mui-focusVisible": {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          };
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
    >
      {startIcon}
      <Typography variant="body2" color="text.secondary" component="span">
        {label}
      </Typography>
    </ButtonBase>
  );
}
