import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import { searchFieldMutedBackground } from "../../shared-theme/interactiveSurfaces.js";
import { DATABASE_VIEWER_BODY_ROW_GAP_PX } from "./databaseViewerTableStyles.js";

const ROW_ESTIMATE_PX = 44;
const ROW_BAR_HEIGHT_PX = ROW_ESTIMATE_PX - DATABASE_VIEWER_BODY_ROW_GAP_PX;
const SKELETON_ROW_COUNT = 8;

const databaseViewerSkeletonWaveKeyframe = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
`;

const skeletonRowSx: SxProps<Theme> = {
  p: 0,
  border: 0,
  height: ROW_ESTIMATE_PX,
  position: "relative",
  overflow: "hidden",
  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
  backgroundImage: (theme: Theme) => {
    const bar = searchFieldMutedBackground(theme);
    return `linear-gradient(to bottom, ${bar} 0, ${bar} ${ROW_BAR_HEIGHT_PX}px, transparent ${ROW_BAR_HEIGHT_PX}px, transparent ${ROW_ESTIMATE_PX}px)`;
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: (theme: Theme) =>
      `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
    transform: "translateX(-100%)",
    animation: `${databaseViewerSkeletonWaveKeyframe} 2s linear 0.5s infinite`,
    pointerEvents: "none",
  },
};

export function DatabaseViewerLoadingSkeleton({
  ariaLabel,
  colCount,
}: {
  ariaLabel: string;
  colCount: number;
}) {
  return (
    <Box aria-busy="true" aria-live="polite" role="status">
      {/* MUI `width: 1` / `height: 1` = 100% — must clip, else "Tabel laden…" paints over skeleton */}
      <Box
        component="span"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        Tabel laden…
      </Box>
      <Table size="small" aria-label={ariaLabel} aria-busy="true">
        <TableBody>
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
            <TableRow key={`skel-${i}`} aria-hidden>
              <TableCell colSpan={Math.max(colCount, 1)} sx={skeletonRowSx} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
