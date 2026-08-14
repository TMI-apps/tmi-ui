import { alpha, type Theme } from "@mui/material/styles";

/**
 * Background tints using `text.primary` opacity — used for table row surfaces / skins so list areas
 * feel cohesive in light and dark mode.
 */
export function searchFieldMutedBackground(theme: Theme): string {
  return alpha(theme.palette.text.primary, 0.04);
}

export function searchFieldMutedHoverBackground(theme: Theme): string {
  return alpha(theme.palette.text.primary, 0.1);
}

/** Slightly subtler base for “lightweight” table skins; hover still uses {@link searchFieldMutedHoverBackground}. */
export function searchFieldMutedBackgroundLightweight(theme: Theme): string {
  return alpha(theme.palette.text.primary, 0.02);
}
