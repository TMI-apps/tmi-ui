## Required setup: theme + provider

`@tmi-packages/ui` is **headless** — it has no hardcoded brand color or font. It ships an MUI theme *augmentation*, but several components read theme fields that only exist after you run the package's own theme factory. **Skipping this crashes `DetailPanelHeroHeader`, `TMITableWorkspace`, `RecordWorkspaceShell`, `TMITableDetailEditPanel`, `TMITable`/`DatabaseViewer`'s detail-hero integration, and `PrimaryContainedAutocompleteBar`/`ListRowAddButton`'s primary variant** (they read `theme.detailPanelHero`, `theme.tmiTableWorkspace`, `theme.tmiPrimaryContained` — none of which exist on a bare MUI theme).

Wrap your app root once:

```tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createTmiTableTheme, PortaledOverlayStackProvider } from "@tmi-packages/ui";

const theme = createTmiTableTheme(createTheme({ palette: { mode: "light" } }));

function App({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <PortaledOverlayStackProvider hostModalZ={1300}>
        {children}
      </PortaledOverlayStackProvider>
    </ThemeProvider>
  );
}
```

`createTmiTableTheme` is additive — pass it *your* brand `createTheme(...)` call as its `base` argument and it merges in the required tokens without touching your palette/typography. `PortaledOverlayStackProvider` isn't strictly required everywhere, but wrap it around anything using the `AutocompleteSelect` family or table detail drawers so portaled poppers/menus stack correctly above modals (`hostModalZ` should match your outermost modal's z-index if you have one; `1300` — MUI's default modal z-index — is a safe default otherwise).

## Styling idiom: no classes, no CSS variables

This is a **CSS-in-JS (MUI + Emotion) design system** — there is no utility-class vocabulary and no `var(--token-*)` scale to hand out. Style everything through MUI's own surface:
- Layout/spacing/color via the `sx` prop, using theme-relative values (`sx={{ p: 2, bgcolor: "background.paper" }}`), not raw pixels or hex where a theme token exists.
- Reach for the augmented theme fields directly when composing around these components: `theme.detailPanelHero`, `theme.tmiPrimaryContained.gradient`, `theme.palette.primary.surface` / `surfaceHover` (mode-aware low-opacity brand tints — fall back to `alpha(palette.primary.main, ...)` if a consumer theme predates this augmentation).
- Never invent a class name (`.tmi-button`, `.ds-card`) — nothing in this DS looks for one.

## Where the truth lives

Read `styles.css` and `README.md` at the bundle root first — the README documents every component's real prop surface. `guidelines/docs/` (bundled from this repo's own `docs/`) has deeper context: `installation.md`, `consumer-setup.md`, `component-ingest.md`, `tmi-table.md` (the table/detail-workspace family specifically), `release-flow.md`.

## Build example (adapted from a verified preview)

```tsx
<DetailPanelHeroHeader
  loading={false}
  recordPresent
  title="Bibliotheek Rotterdam"
  subtitle="Workshop detail hero"
  isAdmin={false}
  onClose={() => setDetailOpen(false)}
  heroImageMeta={{ src: coverUrl, fallbackSrc: null }}
  statsStrip={
    <DetailPanelHeroStatsStrip
      items={[{ label: "Rows", value: "128" }, { label: "Selected", value: "3" }]}
    />
  }
/>
```

`heroImageMeta.fallbackSrc` is required (pass `null`, not omitted) even when you have no fallback image.
