import { DetailPanelHeroStatsStrip } from "@tmi-packages/ui";

// Read-only strip, as used under DetailPanelHeroHeader's default (non-admin) record view.
export function Default() {
  return (
    <DetailPanelHeroStatsStrip
      items={[
        { label: "Rows", value: "128" },
        { label: "Selected", value: "3" },
      ]}
    />
  );
}

// Interactive cells (onClick present) open an edit affordance per stat — hover/focus
// states are handled by the cell's own ButtonBase; one cell is disabled.
export function InteractiveWithError() {
  return (
    <DetailPanelHeroStatsStrip
      items={[
        { label: "Rows", value: "42", onClick: () => undefined },
        {
          label: "Errors",
          value: "5",
          error: true,
          onClick: () => undefined,
        },
        {
          label: "Locked",
          value: "0",
          disabled: true,
          onClick: () => undefined,
        },
      ]}
    />
  );
}

// A single stat still lays out as a full-width strip.
export function SingleStat() {
  return <DetailPanelHeroStatsStrip items={[{ label: "Records", value: "1,204" }]} />;
}
