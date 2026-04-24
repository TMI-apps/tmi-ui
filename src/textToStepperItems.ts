/**
 * Step item for checklist display
 * Main steps can have sub-steps (children) - lines with 2+ spaces indent
 */
export interface StepItem {
  id: string;
  text: string;
  index: number;
  /** Sub-steps (lines with 2+ spaces indent under this step) - no checkbox, display only */
  children?: StepItem[];
}

/**
 * Extract step text from a line (strip numbered/bullet prefix)
 */
function extractStepText(line: string): string {
  const numberedRegex = /^(\d+)[.)-]\s*(.+)$/;
  const bulletRegex = /^[-*•]\s*(.+)$/;
  const numberedMatch = line.match(numberedRegex);
  const bulletMatch = line.match(bulletRegex);
  if (numberedMatch) return numberedMatch[2].trim();
  if (bulletMatch) return bulletMatch[1].trim();
  return line.trim();
}

/**
 * Parse instruction text into checklist steps with optional sub-steps
 * - Lines without leading indent (or < 2 spaces) = main step
 * - Lines with 2+ spaces leading indent = sub-step of previous main step
 * Detects: numbered lists, bullet lists, plain lines
 */
export function textToStepperItems(text: string | unknown): StepItem[] {
  const str = typeof text === "string" ? text : "";
  if (!str) {
    return [];
  }

  const lines = str.split(/\r?\n/).filter((line) => line.trim() !== "");
  const steps: StepItem[] = [];
  let mainIndex = 0;

  for (const line of lines) {
    const leadingSpaces = line.length - line.trimStart().length;
    const trimmed = line.trim();
    const isSubStep = leadingSpaces >= 2;
    const stepText = extractStepText(trimmed);

    if (!stepText || stepText === "[object Object]") continue;

    if (isSubStep) {
      if (steps.length > 0) {
        const last = steps[steps.length - 1];
        const children = last.children ?? [];
        children.push({
          id: `${last.id}-sub-${children.length}`,
          text: stepText,
          index: children.length,
        });
        last.children = children;
      } else {
        steps.push({
          id: `step-${mainIndex}`,
          text: stepText,
          index: mainIndex,
        });
        mainIndex++;
      }
    } else {
      steps.push({
        id: `step-${mainIndex}`,
        text: stepText,
        index: mainIndex,
        children: [],
      });
      mainIndex++;
    }
  }

  return steps.map((s) => {
    if (s.children?.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit empty children
      const { children, ...rest } = s;
      return rest;
    }
    return s;
  });
}
