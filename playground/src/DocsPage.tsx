import { Box, Divider, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactElement } from "react";
import {
  docSources,
  extractMarkdownHeadings,
  type DocSource,
} from "./docsSources.js";
import {
  WorkshopLayout,
  WorkshopSection,
  WorkshopSidebar,
  navigateWorkshopSection,
  type WorkshopTocItem,
} from "./layout/WorkshopLayout.js";
import { resolveMarkdownHref } from "./markdownLinkResolver.js";

function docSectionId(doc: DocSource): string {
  return `doc-${doc.id}`;
}

function headingAnchorId(doc: DocSource, headingId: string): string {
  return `${docSectionId(doc)}--${headingId}`;
}

function buildDocsToc(): WorkshopTocItem[] {
  const items: WorkshopTocItem[] = [];
  for (const doc of docSources) {
    items.push({ id: docSectionId(doc), label: doc.title });
    for (const heading of extractMarkdownHeadings(doc.content)) {
      items.push({
        id: headingAnchorId(doc, heading.id),
        label: `  ${heading.text}`,
      });
    }
  }
  return items;
}

function MarkdownDoc({ doc }: { doc: DocSource }): ReactElement {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const text = String(children);
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          return (
            <Typography
              id={headingAnchorId(doc, id)}
              variant="h5"
              component="h3"
              sx={{ mt: 2, mb: 1, scrollMarginTop: 16 }}
            >
              {children}
            </Typography>
          );
        },
        h2: ({ children }) => {
          const text = String(children);
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          return (
            <Typography
              id={headingAnchorId(doc, id)}
              variant="h6"
              component="h4"
              sx={{ mt: 2, mb: 1, scrollMarginTop: 16 }}
            >
              {children}
            </Typography>
          );
        },
        h3: ({ children }) => {
          const text = String(children);
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          return (
            <Typography
              id={headingAnchorId(doc, id)}
              variant="subtitle1"
              component="h5"
              sx={{ mt: 1.5, mb: 0.5, scrollMarginTop: 16 }}
            >
              {children}
            </Typography>
          );
        },
        p: ({ children }) => (
          <Typography variant="body2" component="p" sx={{ mb: 1 }}>
            {children}
          </Typography>
        ),
        a: ({ href, children }) => {
          const resolved = href
            ? resolveMarkdownHref(href, doc.path)
            : undefined;
          if (resolved?.startsWith("#")) {
            const targetId = resolved.slice(1);
            return (
              <Typography
                component="a"
                variant="body2"
                href={resolved}
                onClick={(event) => {
                  event.preventDefault();
                  navigateWorkshopSection(targetId);
                }}
                sx={{ color: "primary.main" }}
              >
                {children}
              </Typography>
            );
          }
          return (
            <Typography
              component="a"
              variant="body2"
              href={resolved ?? href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main" }}
            >
              {children}
            </Typography>
          );
        },
        code: ({ children }) => (
          <Box
            component="code"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.85em",
              bgcolor: "action.hover",
              px: 0.5,
              borderRadius: 0.5,
            }}
          >
            {children}
          </Box>
        ),
        pre: ({ children }) => (
          <Box
            component="pre"
            sx={{
              p: 1.5,
              mb: 2,
              overflow: "auto",
              bgcolor: "action.hover",
              borderRadius: 1,
              fontSize: "0.8rem",
            }}
          >
            {children}
          </Box>
        ),
      }}
    >
      {doc.content}
    </ReactMarkdown>
  );
}

export function DocsPage(): ReactElement {
  const toc = buildDocsToc();
  return (
    <WorkshopLayout sidebar={<WorkshopSidebar title="Docs" items={toc} />}>
      {docSources.map((doc) => (
        <WorkshopSection
          key={doc.path}
          id={docSectionId(doc)}
          title={`${doc.title} (${doc.path})`}
        >
          <MarkdownDoc doc={doc} />
          <Divider sx={{ mt: 3 }} />
        </WorkshopSection>
      ))}
    </WorkshopLayout>
  );
}
