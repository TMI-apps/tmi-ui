import { useState, useCallback, type MouseEvent } from "react";
import { Box, Typography, useTheme, alpha, type Theme } from "@mui/material";
import { textToStepperItems } from "../textToStepperItems.js";
import { usePersistentSteps, type ChecklistStorageScope } from "../usePersistentSteps.js";
import { PersistentStepperStepItem, type ChecklistSizing } from "./PersistentStepperStepItem.js";

export type ChecklistProgressSummaryVariant = "steps" | "criteria";

export interface PersistentStepperListLabels {
  formatProgress: (
    completed: number,
    total: number,
    variant: ChecklistProgressSummaryVariant
  ) => string;
  /** aria-label when sub-steps are collapsed (click to expand) */
  ariaExpandSubSteps: string;
  /** aria-label when sub-steps are expanded (click to collapse) */
  ariaCollapseSubSteps: string;
}

const defaultLabels: PersistentStepperListLabels = {
  formatProgress: (completed, total, variant) => {
    if (variant === "criteria") {
      return `Completed ${completed} of ${total} criteria`;
    }
    return `${completed} of ${total} steps completed`;
  },
  ariaExpandSubSteps: "Expand sub-steps",
  ariaCollapseSubSteps: "Collapse sub-steps",
};

function mergeLabels(partial?: Partial<PersistentStepperListLabels>): PersistentStepperListLabels {
  return { ...defaultLabels, ...partial };
}

interface PersistentStepperListProps {
  /** Stable id for localStorage (e.g. activity id, product id) */
  activityId: string;
  language?: string;
  instructionText: string;
  /** Default `activity`; use app-specific values (e.g. `productkaart`) to avoid localStorage key clashes */
  storageScope?: ChecklistStorageScope;
  /** Werkvorm progress vs product criteria wording */
  progressSummaryVariant?: ChecklistProgressSummaryVariant;
  /** Override default English strings */
  labels?: Partial<PersistentStepperListLabels>;
}

function getChecklistSizing(theme: Theme): ChecklistSizing {
  const t = theme.checklist ?? {
    circleSize: 32,
    mainStepGap: 4,
    subStepGap: 3,
    subItemsPl: 8,
    subBulletSize: 6,
    circleFontSize: 18,
  };
  return {
    circleSize: t.circleSize,
    mainStepGap: t.mainStepGap,
    subStepGap: t.subStepGap,
    subItemsPl: t.subItemsPl,
    subBulletSize: t.subBulletSize,
    circleFontSize: t.circleFontSize,
  };
}

/**
 * Checklist with optional localStorage persistence: parses `instructionText` into steps
 * (indented lines = sub-steps). Main steps: checkbox; sub-steps: bullets only.
 */
export const PersistentStepperList = ({
  activityId,
  language = "en",
  instructionText,
  storageScope = "activity",
  progressSummaryVariant = "steps",
  labels: labelsProp,
}: PersistentStepperListProps) => {
  const theme = useTheme();
  const labels = mergeLabels(labelsProp);
  const steps = textToStepperItems(instructionText);
  const mainStepIds = steps.map((s) => s.id);
  const { toggleStep, isChecked, completedCount, totalCount } = usePersistentSteps({
    entityId: activityId,
    language,
    stepIds: mainStepIds,
    storageScope,
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    steps.forEach((s) => {
      init[s.id] = (s.children?.length ?? 0) > 0;
    });
    return init;
  });

  const toggleExpand = useCallback((stepId: string, e: MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  }, []);

  if (steps.length === 0) {
    return null;
  }

  const gradientBullet = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const hoverBg = theme.palette.primary.surface ?? alpha(theme.palette.primary.main, 0.08);
  const sizing = getChecklistSizing(theme);

  return (
    <Box>
      {totalCount > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {labels.formatProgress(completedCount, totalCount, progressSummaryVariant)}
        </Typography>
      )}
      <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
        {steps.map((step) => {
          const checked = isChecked(step.id);
          const hasChildren = (step.children?.length ?? 0) > 0;
          const isExpanded = hasChildren && (expanded[step.id] ?? true);

          return (
            <PersistentStepperStepItem
              key={step.id}
              step={step}
              checked={checked}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              sizing={sizing}
              gradientBullet={gradientBullet}
              hoverBg={hoverBg}
              onToggleStep={toggleStep}
              onToggleExpand={toggleExpand}
              ariaExpandSubSteps={labels.ariaExpandSubSteps}
              ariaCollapseSubSteps={labels.ariaCollapseSubSteps}
            />
          );
        })}
      </Box>
    </Box>
  );
};
