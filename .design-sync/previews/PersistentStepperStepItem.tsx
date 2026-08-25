import { Box, alpha, useTheme } from "@mui/material";
import { PersistentStepperStepItem } from "@tmi-packages/ui";
import { useState } from "react";

// PersistentStepperStepItem is a leaf row with no defaults for `sizing`,
// `gradientBullet`, `hoverBg`, or the toggle callbacks — it throws outside a real
// list composition. This mirrors exactly what PersistentStepperList itself builds
// (see src/PersistentStepperList/PersistentStepperList.tsx getChecklistSizing /
// gradientBullet / hoverBg), rendered inside the same <ul> wrapper it uses.

const sizing = {
  circleSize: 32,
  mainStepGap: 4,
  subStepGap: 3,
  subItemsPl: 8,
  subBulletSize: 6,
  circleFontSize: 18,
};

// Unchecked main step with two sub-steps, expanded.
export function Expanded() {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const gradientBullet = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const hoverBg = alpha(theme.palette.primary.main, 0.08);

  return (
    <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
      <PersistentStepperStepItem
        step={{
          id: "step-0",
          text: "Review the submitted materials",
          index: 0,
          children: [
            { id: "step-0-sub-0", text: "Check title and description", index: 0 },
            { id: "step-0-sub-1", text: "Verify media links resolve", index: 1 },
          ],
        }}
        checked={checked}
        isExpanded={isExpanded}
        hasChildren
        sizing={sizing}
        gradientBullet={gradientBullet}
        hoverBg={hoverBg}
        onToggleStep={() => setChecked((c) => !c)}
        onToggleExpand={(_id, e) => {
          e.stopPropagation();
          setIsExpanded((v) => !v);
        }}
        ariaExpandSubSteps="Expand sub-steps"
        ariaCollapseSubSteps="Collapse sub-steps"
      />
    </Box>
  );
}

// Checked main step, no sub-steps — the checked/no-children rest state.
export function CheckedNoChildren() {
  const theme = useTheme();
  const [checked, setChecked] = useState(true);
  const gradientBullet = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const hoverBg = alpha(theme.palette.primary.main, 0.08);

  return (
    <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
      <PersistentStepperStepItem
        step={{ id: "step-1", text: "Submit for review", index: 1 }}
        checked={checked}
        isExpanded={false}
        hasChildren={false}
        sizing={sizing}
        gradientBullet={gradientBullet}
        hoverBg={hoverBg}
        onToggleStep={() => setChecked((c) => !c)}
        onToggleExpand={() => undefined}
        ariaExpandSubSteps="Expand sub-steps"
        ariaCollapseSubSteps="Collapse sub-steps"
      />
    </Box>
  );
}

// Sub-steps collapsed — the toggle-icon-rotated, Collapse-closed state.
export function CollapsedSubSteps() {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const gradientBullet = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const hoverBg = alpha(theme.palette.primary.main, 0.08);

  return (
    <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
      <PersistentStepperStepItem
        step={{
          id: "step-2",
          text: "Publish the activity",
          index: 2,
          children: [
            { id: "step-2-sub-0", text: "Confirm audience visibility", index: 0 },
          ],
        }}
        checked={false}
        isExpanded={isExpanded}
        hasChildren
        sizing={sizing}
        gradientBullet={gradientBullet}
        hoverBg={hoverBg}
        onToggleStep={() => undefined}
        onToggleExpand={(_id, e) => {
          e.stopPropagation();
          setIsExpanded((v) => !v);
        }}
        ariaExpandSubSteps="Expand sub-steps"
        ariaCollapseSubSteps="Collapse sub-steps"
      />
    </Box>
  );
}
