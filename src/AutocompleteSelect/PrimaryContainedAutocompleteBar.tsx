import Add from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { useRef, type ReactNode } from "react";

import {
  AutocompleteSelectField,
  type AutocompleteSelectFieldProps,
} from "./AutocompleteSelectField.js";
import { getTableInteractionSkin } from "../DataTable/lesmateriaal-import/shared-theme/tableInteractionSkin.js";
import { resolveTmiPrimaryContained } from "./tmiPrimaryContained.js";

/**
 * Outer-shell sx for the primary-gradient autocomplete bar — matches the
 * {@link ListRowAddButton} `visualVariant="primary"` metrics so a
 * collapsed add-button expanding into a search field has no visual jump.
 *
 * Note: no horizontal padding on the bar. The TextField's `MuiOutlinedInput-root` (the MUI
 * `Autocomplete` popper anchor) must span the full bar width — otherwise the popper ends up
 * narrower than the bar. Horizontal breathing room is handled inside the field instead (via a
 * `startAdornment` with its own margin).
 */
function primaryContainedAutocompleteBarOuterSx(theme: Theme) {
  const skin = getTableInteractionSkin(theme, "lightweight");
  const contained = resolveTmiPrimaryContained(theme);
  const h = skin.rowMinHeightPx;
  const r = `${skin.rowBorderRadiusPx}px`;
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
    padding: 0,
    borderRadius: r,
    overflow: "hidden",
    boxSizing: "border-box",
    boxShadow: contained.restShadow,
    background: contained.gradient,
    backgroundSize: "200% 200%",
    backgroundPosition: "0% 50%",
    color: theme.palette.common.white,
    textTransform: "none",
    fontSize: theme.typography.body2.fontSize ?? "0.875rem",
    fontWeight:
      theme.typography.body2.fontWeight ??
      theme.typography.fontWeightRegular ??
      400,
    lineHeight: 1,
  };
}

type OwnedAutocompleteBarKeys =
  | "fillCell"
  | "fillCellSurface"
  | "fillCellDropdownWidthRef"
  | "startAdornment";

/** `Omit` does not distribute over unions — without this, multiple-only props like `onClose` are lost. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * Props: every {@link AutocompleteSelectField} prop minus the ones this component owns internally
 * (`fillCell`, `fillCellSurface`, `fillCellDropdownWidthRef`, `startAdornment`), plus a `startIcon`
 * override for the in-field leading icon.
 *
 * Discriminated-union `mode` ("multiple" | "single") is preserved.
 */
export type PrimaryContainedAutocompleteBarProps = DistributiveOmit<
  AutocompleteSelectFieldProps,
  OwnedAutocompleteBarKeys
> & {
  /**
   * Leading icon rendered inside the input (as `AutocompleteSelectField.startAdornment`).
   * Defaults to `<Add fontSize="small" />`. Pass `null` to render no icon.
   */
  startIcon?: ReactNode;
};

/**
 * Primary-gradient bar housing an `AutocompleteSelectField`. Use this for "toevoegen"-style rows
 * on the lesmateriaal edit pane (hierarchy, doelen, tags, …) so they share a single source of
 * truth for the shell styling, the bar-wide dropdown alignment, and the leading `+` icon.
 *
 * Why this wrapper exists (don't duplicate it in features):
 * - The outer shell matches `ListRowAddButton` primary metrics, so a collapse ↔ expand never jumps.
 * - The bar has no horizontal padding, so the input itself spans the full bar. MUI's popper anchor
 *   is the input; therefore the portaled dropdown's width and left edge align with the bar — not
 *   with a narrower inner region.
 * - A bar-wide ref is wired to `fillCellDropdownWidthRef` and, combined with sx `min-width`,
 *   clamps the popper's inline `style.width = anchorEl.clientWidth` upward to the full bar.
 * - The `+` icon lives inside the input as `startAdornment` with a small `ml` so it doesn't butt
 *   against the bar's left edge.
 */
export function PrimaryContainedAutocompleteBar({
  startIcon,
  ...fieldProps
}: PrimaryContainedAutocompleteBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const resolvedStartIcon =
    startIcon === undefined ? (
      <Add fontSize="small" sx={{ flexShrink: 0, ml: 1 }} />
    ) : (
      startIcon
    );
  return (
    <Box
      ref={barRef}
      sx={(theme) => primaryContainedAutocompleteBarOuterSx(theme)}
    >
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minWidth: 0,
          alignSelf: "stretch",
        }}
      >
        <AutocompleteSelectField
          {...(fieldProps as AutocompleteSelectFieldProps)}
          fillCell
          fillCellSurface="primaryContained"
          fillCellDropdownWidthRef={barRef}
          startAdornment={resolvedStartIcon}
        />
      </Box>
    </Box>
  );
}
