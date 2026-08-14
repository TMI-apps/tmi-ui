import type { ReactNode } from "react";
import { useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DetailPanelHeroHeader,
  type DetailPanelHeroHeaderProps,
} from "./DetailPanelHeroHeader.js";
import type { DetailPanelFileDropSurface } from "./detailPanelFileDropSurface.js";

export interface TMITableDetailEditPanelProps {
  headerProps: DetailPanelHeroHeaderProps;
  detailTransitioning: boolean;
  detailError: string | null;
  children: ReactNode;
  /** When set, the full pane (hero + scroll body) accepts file/link drops. */
  fileDropSurface?: DetailPanelFileDropSurface | null;
}

/**
 * Hero + scroll body with transitioning spinner and error alert. Children render read/edit content.
 */
export function TMITableDetailEditPanel({
  headerProps,
  detailTransitioning,
  detailError,
  children,
  fileDropSurface,
}: TMITableDetailEditPanelProps) {
  const theme = useTheme();
  const scrollBody = theme.detailPanelHero.scrollBody;
  const [heroBottomPaddingPx, setHeroBottomPaddingPx] = useState(
    scrollBody.paddingTopPx,
  );
  return (
    <Box
      sx={(t) => ({
        flex: 1,
        minHeight: 0,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        ...(fileDropSurface
          ? {
              ...fileDropSurface.dropSurfaceSx(t),
              borderRadius: 0,
            }
          : {}),
      })}
      {...(fileDropSurface?.dropHandlers ?? {})}
    >
      <DetailPanelHeroHeader
        {...headerProps}
        onHeroBottomPxChange={setHeroBottomPaddingPx}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          px: `${scrollBody.paddingXPx}px`,
          pt: `${heroBottomPaddingPx}px`,
          pb: `${scrollBody.paddingBottomPx}px`,
        }}
      >
        {detailTransitioning && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {detailError && !detailTransitioning && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {detailError}
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
}

/** @deprecated Prefer {@link TMITableDetailEditPanel} */
export const RecordDetailEditPanel = TMITableDetailEditPanel;

/** @deprecated Prefer {@link TMITableDetailEditPanelProps} */
export type RecordDetailEditPanelProps = TMITableDetailEditPanelProps;
