import { Box } from "@mui/material";
import { DetailPanelHeroHeader, DetailPanelHeroStatsStrip } from "@tmi-packages/ui";

const COVER_URL = "https://picsum.photos/seed/tmi-ui-detail-hero/960/360";

export function Record() {
  return (
    <Box sx={{ minHeight: 320, position: "relative" }}>
      <DetailPanelHeroHeader
        loading={false}
        recordPresent
        title="Bibliotheek Rotterdam"
        subtitle="Workshop detail hero"
        isAdmin={false}
        onClose={() => undefined}
        heroImageMeta={{ src: COVER_URL, fallbackSrc: null }}
        statsStrip={
          <DetailPanelHeroStatsStrip
            items={[
              { label: "Rows", value: "128" },
              { label: "Selected", value: "3" },
            ]}
          />
        }
      />
    </Box>
  );
}

export function Loading() {
  return (
    <Box sx={{ minHeight: 320, position: "relative" }}>
      <DetailPanelHeroHeader
        loading
        recordPresent={false}
        title=""
        subtitle=""
        isAdmin={false}
        onClose={() => undefined}
      />
    </Box>
  );
}

export function AdminRecord() {
  return (
    <Box sx={{ minHeight: 320, position: "relative" }}>
      <DetailPanelHeroHeader
        loading={false}
        recordPresent
        title="Bibliotheek Utrecht"
        subtitle="Admin editing view"
        isAdmin
        canDelete
        onDelete={() => undefined}
        onClose={() => undefined}
        heroImageMeta={{ src: COVER_URL, fallbackSrc: null }}
        statsStrip={
          <DetailPanelHeroStatsStrip
            items={[
              { label: "Rows", value: "42" },
              { label: "Selected", value: "0" },
            ]}
          />
        }
      />
    </Box>
  );
}
