const GITHUB_REPO = "https://github.com/TMI-apps/tmi-ui/blob/main";

export function resolveMarkdownHref(
  href: string,
  currentDocPath: string,
): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (href.startsWith("#")) {
    return href;
  }
  if (href.startsWith(".agents/")) {
    return `${GITHUB_REPO}/${href}`;
  }
  if (href.startsWith("docs/")) {
    const targetId = href
      .replace(/^docs\//, "docs-")
      .replace(/\.md$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    return `#${targetId}`;
  }
  if (href.startsWith("./docs/")) {
    return resolveMarkdownHref(href.slice(1), currentDocPath);
  }
  if (href.startsWith("./")) {
    const baseDir = currentDocPath.includes("/")
      ? currentDocPath.slice(0, currentDocPath.lastIndexOf("/"))
      : "";
    const joined = baseDir ? `${baseDir}/${href.slice(2)}` : href.slice(2);
    return resolveMarkdownHref(joined, currentDocPath);
  }
  if (href.endsWith(".md")) {
    const targetId = href
      .replace(/\.md$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    return `#${targetId}`;
  }
  return `${GITHUB_REPO}/${href}`;
}
