export type DocSource = {
  id: string;
  path: string;
  title: string;
  content: string;
};

function titleFromPath(filePath: string): string {
  if (filePath.endsWith("README.md")) return "README";
  const base = filePath.split("/").pop() ?? filePath;
  return base.replace(/\.md$/, "");
}

function idFromPath(filePath: string): string {
  return filePath
    .replace(/\.md$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const rawModules = import.meta.glob(
  ["../../../README.md", "../../../docs/**/*.md"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

export const docSources: DocSource[] = Object.entries(rawModules)
  .filter(([filePath]) => !filePath.includes("/docs/jobs/"))
  .map(([filePath, content]) => {
    const normalized = filePath.replace(/^\.\.\/\.\.\/\.\.\//, "");
    return {
      id: idFromPath(normalized),
      path: normalized,
      title: titleFromPath(normalized),
      content,
    };
  })
  .sort((a, b) => {
    if (a.path === "README.md") return -1;
    if (b.path === "README.md") return 1;
    return a.path.localeCompare(b.path);
  });

export function extractMarkdownHeadings(
  markdown: string,
): Array<{ id: string; text: string }> {
  const headings: Array<{ id: string; text: string }> = [];
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^#{1,3}\s+(.+)$/);
    if (!match) continue;
    const text = match[1].replace(/`([^`]+)`/g, "$1").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text });
  }
  return headings;
}
