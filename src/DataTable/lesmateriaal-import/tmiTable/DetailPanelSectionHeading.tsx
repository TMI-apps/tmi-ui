import Typography, { type TypographyProps } from "@mui/material/Typography";
import { useTheme, type SxProps, type Theme } from "@mui/material/styles";
import { detailFieldLabelSx } from "./detailHeroTypography.js";

/**
 * Section and field headings in detail + edit-detail panes (uppercase micro-label).
 */
export function DetailPanelSectionHeading({ sx, ...props }: TypographyProps) {
  const theme = useTheme();
  const mergedSx: SxProps<Theme> =
    sx === undefined
      ? detailFieldLabelSx(theme)
      : ([detailFieldLabelSx(theme), sx] as SxProps<Theme>);
  return <Typography variant="caption" sx={mergedSx} {...props} />;
}
