import { PersistentStepperList } from "@tmi-packages/ui";

// Real usage (playground visualSections.tsx StepperDemo) — flat main steps only.
export function Default() {
  return (
    <PersistentStepperList
      activityId="ds-preview-flat"
      instructionText={`1. Read the assignment brief
2. Draft the outline
3. Submit for review`}
    />
  );
}

// instructionText supports 2+-space-indented sub-step lines under a main step —
// these render as bulleted, non-checkable detail lines in a collapsible section.
export function WithSubSteps() {
  return (
    <PersistentStepperList
      activityId="ds-preview-nested"
      instructionText={`1. Main step one
  Sub-step detail A
  Sub-step detail B
2. Main step two
  Sub-step detail C
3. Main step three`}
    />
  );
}

// Criteria wording variant, e.g. product/checklist review flows rather than activity steps.
export function CriteriaVariant() {
  return (
    <PersistentStepperList
      activityId="ds-preview-criteria"
      progressSummaryVariant="criteria"
      instructionText={`1. Titel is duidelijk en beschrijvend
2. Alle verplichte velden zijn ingevuld
3. Media is correct gekoppeld`}
    />
  );
}
