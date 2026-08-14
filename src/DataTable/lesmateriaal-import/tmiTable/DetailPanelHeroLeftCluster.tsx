import ArrowBack from "@mui/icons-material/ArrowBack";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import { IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { detailHeroOverlayIconButtonSx } from "./detailHeroTypography.js";
import { useWorkspaceDetailFullscreen } from "./context/WorkspaceDetailFullscreenContext.js";

export type DetailPanelHeroLeftClusterProps = {
  onBack?: () => void;
};

/**
 * Top-left hero controls: Terug (when nested) + optional workspace primary-column toggle (`lg+` split only).
 */
export function DetailPanelHeroLeftCluster({
  onBack,
}: DetailPanelHeroLeftClusterProps) {
  const theme = useTheme();
  const fullscreen = useWorkspaceDetailFullscreen();
  const showToggle = Boolean(fullscreen?.available);
  const showBack = Boolean(onBack);

  if (!showToggle && !showBack) return null;

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "flex-start" }}>
      {showBack ? (
        <IconButton
          aria-label="Terug"
          onClick={onBack}
          size="small"
          sx={detailHeroOverlayIconButtonSx(theme)}
        >
          <ArrowBack />
        </IconButton>
      ) : null}
      {showToggle ? (
        <IconButton
          aria-label={fullscreen!.active ? "Tabel tonen" : "Tabel verbergen"}
          title={fullscreen!.active ? "Tabel tonen" : "Tabel verbergen"}
          onClick={fullscreen!.toggle}
          size="small"
          sx={detailHeroOverlayIconButtonSx(theme)}
        >
          {fullscreen!.active ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      ) : null}
    </Stack>
  );
}
