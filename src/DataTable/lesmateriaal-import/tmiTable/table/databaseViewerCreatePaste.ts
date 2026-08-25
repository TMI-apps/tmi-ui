/** Split clipboard text into create values: newlines separate rows; blank lines are skipped. */
export function splitCreatePasteLines(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => line.trim() !== "");
}
