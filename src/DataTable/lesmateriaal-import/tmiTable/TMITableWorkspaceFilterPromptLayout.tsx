import { Box, Collapse, Fade, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { type ReactNode } from "react";
import { TMITABLE_FILTER_PROMPT_DEFAULT_CUE } from "./tmiTableFilterPromptConstants.js";
import { useFilterPromptDockTransition } from "./hooks/useFilterPromptDockTransition.js";

export type TMITableWorkspacePrimaryColumnProps = {
  effectiveFill: boolean;
  leftHeader: ReactNode;
  table: ReactNode;
  filterPromptActive: boolean;
  filterPromptCue?: ReactNode;
};

/** Material decelerate — matches chat “composer docks” feel. */
const DOCK_EASING = "cubic-bezier(0.2, 0, 0, 1)";

/** Visible dock duration (imperative FLIP cleared by React Strict Mode effect cleanup). */
export const FILTER_PROMPT_DOCK_MS = 380;

function FilterPromptCue({ children }: { children: ReactNode }) {
  if (typeof children === "string" || typeof children === "number") {
    return (
      <Typography
        component="p"
        role="status"
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 2 }}
      >
        {children}
      </Typography>
    );
  }

  return (
    <Box
      role="status"
      sx={{
        textAlign: "center",
        mb: 2,
        color: "text.secondary",
        typography: "body2",
      }}
    >
      {children}
    </Box>
  );
}

function DockSpacer({
  expanded,
  durationMs,
  reducedMotion,
}: {
  expanded: boolean;
  durationMs: number;
  reducedMotion: boolean;
}) {
  return (
    <Box
      aria-hidden
      data-testid={
        expanded
          ? "tmi-workspace-dock-spacer-expanded"
          : "tmi-workspace-dock-spacer"
      }
      sx={{
        height: expanded ? "28vh" : 0,
        flexShrink: 0,
        transition: reducedMotion
          ? "none"
          : `height ${durationMs}ms ${DOCK_EASING}`,
      }}
    />
  );
}

/**
 * Single primary column: filters stay mounted (chat EmptyState → docked chrome).
 * Vertical dock via animating height spacers (Strict Mode–safe; no imperative FLIP).
 */
export function TMITableWorkspacePrimaryColumn({
  effectiveFill,
  leftHeader,
  table,
  filterPromptActive,
  filterPromptCue,
}: TMITableWorkspacePrimaryColumnProps) {
  const theme = useTheme();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", {
    defaultMatches: false,
    noSsr: true,
  });
  const durationMs = reducedMotion ? 0 : FILTER_PROMPT_DOCK_MS;
  const cueCollapseMs = reducedMotion ? 0 : theme.transitions.duration.shorter;

  const { tableEnterToken, playTableEnter } =
    useFilterPromptDockTransition(filterPromptActive);

  const cue = filterPromptCue ?? TMITABLE_FILTER_PROMPT_DEFAULT_CUE;

  return (
    <Box
      data-testid={
        filterPromptActive
          ? "tmi-workspace-idle-column"
          : "tmi-workspace-primary-column"
      }
      sx={{
        minWidth: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        ...(effectiveFill
          ? {
              flex: 1,
              minHeight: 0,
            }
          : {
              flex: { xs: "none", lg: "1 1 auto" },
              ...(filterPromptActive ? { minHeight: 320 } : null),
            }),
      }}
    >
      <DockSpacer
        expanded={filterPromptActive}
        durationMs={durationMs}
        reducedMotion={reducedMotion}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: filterPromptActive ? 720 : "100%",
          mx: "auto",
          flexShrink: 0,
          px: filterPromptActive ? 2 : 0,
          transition: reducedMotion
            ? "none"
            : `max-width ${durationMs}ms ${DOCK_EASING}, padding ${durationMs}ms ${DOCK_EASING}`,
        }}
      >
        <Collapse in={filterPromptActive} timeout={cueCollapseMs} unmountOnExit>
          <FilterPromptCue>{cue}</FilterPromptCue>
        </Collapse>
        {leftHeader}
      </Box>

      {filterPromptActive ? (
        <DockSpacer
          expanded
          durationMs={durationMs}
          reducedMotion={reducedMotion}
        />
      ) : (
        <Fade
          key={tableEnterToken}
          in
          appear={playTableEnter && !reducedMotion}
          timeout={durationMs}
        >
          <Box
            data-testid="tmi-workspace-table-surface"
            data-table-enter-animated={
              playTableEnter && !reducedMotion ? "true" : "false"
            }
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {table}
          </Box>
        </Fade>
      )}
    </Box>
  );
}
